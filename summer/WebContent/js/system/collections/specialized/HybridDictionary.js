/**
 * HybridDictionary
 */

define(["dojo/_base/declare", "system/Type", "collections/IDictionary", "specialized/ListDictionary", "collections/Hashtable"], 
		function(declare, Type, IDictionary, ListDictionary, Hashtable){
	
//	private const int 
	var CutoverPoint = 9;
//  private const int 
	var InitialHashtableSize = 13; 
//	private const int 
	var FixedSizeCutoverPoint = 6;
	
	var HybridDictionary = declare("HybridDictionary", IDictionary,{
		constructor:function(){
			if(arguments.length == 0){
		        this.caseInsensitive = false; 
		        this.hashtable = new Hashtable();
			}else if(arguments.length == 1){
				if(typeof arguments[0] == "number"){
					this.hashtable = new Hashtable(arguments[0]); 
					this.caseInsensitive = false; 
				}else{
					this.caseInsensitive = arguments[0]; 
					this.hashtable = new Hashtable();
				}
			}else if(arguments.length == 2){
				this.caseInsensitive = arguments[1]; 
				this.hashtable = new Hashtable(arguments[1]); 
			}
			this.list = null;
		},
		
//      /// <devdoc>
//      ///    <para>[To be supplied.]</para> 
//      /// </devdoc>
//      public HybridDictionary() {
//      }
//
//      /// <devdoc>
//      ///    <para>[To be supplied.]</para> 
//      /// </devdoc> 
//      public HybridDictionary(int initialSize) : this(initialSize, false) {
//      } 
//
//      /// <devdoc>
//      ///    <para>[To be supplied.]</para>
//      /// </devdoc> 
//      public HybridDictionary(bool caseInsensitive) {
//          this.caseInsensitive = caseInsensitive; 
//      } 
//
//      /// <devdoc> 
//      ///    <para>[To be supplied.]</para>
//      /// </devdoc>
//      public HybridDictionary(int initialSize, bool caseInsensitive) {
//          this.caseInsensitive = caseInsensitive; 
//          if (initialSize >= FixedSizeCutoverPoint) {
//              if (caseInsensitive) { 
//                  hashtable = new Hashtable(initialSize, StringComparer.OrdinalIgnoreCase); 
//              } else {
//                  hashtable = new Hashtable(initialSize); 
//              }
//          }
//      }
		
		Get:function(key) { 
            // <STRIP>
            // Hashtable supports multiple read, one writer thread safety.
            // Although we never made the same guarantee for HybridDictionary,
            // it is still nice to do the same thing here since we have recommended 
            // HybridDictioary as replacement for Hashtable.
            // 
            // </STRIP> 

            /*ListDictionary*/var cachedList = this.list; 
            if (this.hashtable != null) {
                return this.hashtable.Get(key);
            } else if (cachedList != null) {
                return cachedList.Get(key); 
            } else {
                // <STRIP> 
                // cachedList can be null in too cases: 
                //   (1) The dictionary is empty, we will return null in this case
                //   (2) There is writer which is doing ChangeOver. However in that case 
                //       we should see the change to hashtable as well.
                //       So it should work just fine.
                // </STRIP>
                // 
                if (key == null) {
                    throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key)); 
                } 
                return null;
            } 
        },
        Set:function(key, value) {
            if (this.hashtable != null) {
            	this.hashtable.Set(key, value); 
            }
            else if (this.list != null) { 
                if (this.list.Count >= CutoverPoint - 1) { 
                	this.ChangeOver();
                    this.hashtable.Set(key, value); 
                } else {
                	this.list.Set(key, value);
                }
            } 
            else {
            	this.list = new ListDictionary(this.caseInsensitive ? StringComparer.OrdinalIgnoreCase : null); 
            	this.list.Set(key, value); 
            }
        },
        
//        private void 
        ChangeOver:function() {
            /*IDictionaryEnumerator*/var en = this.list.GetEnumerator(); 
            /*Hashtable*/var newTable;
            if (this.caseInsensitive) { 
                newTable = new Hashtable(InitialHashtableSize, StringComparer.OrdinalIgnoreCase); 
            } else {
                newTable = new Hashtable(InitialHashtableSize); 
            }
            while (en.MoveNext()) {
                newTable.Add(en.Key, en.Value);
            } 
            // <STRIP>
            // Keep the order of writing to hashtable and list. 
            // We assume we will see the change in hashtable if list is set to null in 
            // this method in another reader thread.
            // </STRIP> 
            this.hashtable = newTable;
            this.list = null;
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
//        public void 
        Add:function(/*object*/ key, /*object*/ value) {
            if (this.hashtable != null) { 
            	this.hashtable.Add(key, value); 
            } else {
                if (this.list == null) { 
                	this.list = new ListDictionary(this.caseInsensitive ? StringComparer.OrdinalIgnoreCase : null);
                	this.list.Add(key, value);
                }
                else { 
                    if (this.list.Count + 1 >= CutoverPoint) {
                    	this.ChangeOver(); 
                    	this.hashtable.Add(key, value); 
                    } else {
                    	this.list.Add(key, value); 
                    }
                }
            }
        },

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public void 
        Clear:function() { 
            if(this.hashtable != null) {
                var cachedHashtable = this.hashtable;
                this.hashtable = null;
                cachedHashtable.Clear(); 
            }
 
            if( this.list != null) { 
                /*ListDictionary*/var cachedList = this.list;
                this.list = null; 
                cachedList.Clear();
            }
        },
 
        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
//        public bool 
        Contains:function(/*object*/ key) {
            var cachedList = this.list; 
            if (this.hashtable != null) {
                return this.hashtable.Contains(key);
            } else if (cachedList != null) {
                return cachedList.Contains(key); 
            } else {
                if (key == null) { 
                    throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key)); 
                }
                return false; 
            }
        },

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
//        public void 
        CopyTo:function(/*Array*/ array, /*int*/ index)  { 
            if (this.hashtable != null) {
            	this.hashtable.CopyTo(array, index); 
            } else {
            	this.List.CopyTo(array, index);
            }
        }, 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public IDictionaryEnumerator 
        GetEnumerator:function() { 
            if (this.hashtable != null) {
                return this.hashtable.GetEnumerator();
            }
            if (this.list == null) { 
            	this.list = new ListDictionary(this.caseInsensitive ? StringComparer.OrdinalIgnoreCase : null);
            } 
            return this.list.GetEnumerator(); 
        },
 
        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
//        public void 
        Remove:function(/*object*/ key) {
            if (this.hashtable != null) { 
            	this.hashtable.Remove(key);
            }
            else if (this.list != null){
            	this.list.Remove(key); 
            }
            else { 
                if (key == null) { 
                    throw new ArgumentNullException("key", SR.GetString(SR.ArgumentNull_Key));
                } 
            }
        }
	});
	
	Object.defineProperties(HybridDictionary.prototype,{
//		private ListDictionary 
		List: {
            get:function() { 
                if (this.list == null) {
                	this.list = new ListDictionary(this.caseInsensitive ? StringComparer.OrdinalIgnoreCase : null); 
                } 
                return this.list;
            } 
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
//        public int 
        Count: {
            get:function() { 
                var cachedList = this.list;
                if (this.hashtable != null) {
                    return this.hashtable.Count;
                } else if (cachedList != null) { 
                    return cachedList.Count;
                } else { 
                    return 0; 
                }
            } 
        },

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
//        public ICollection 
        Keys: { 
            get:function() { 
                if (this.hashtable != null) {
                    return this.hashtable.Keys; 
                } else {
                    return this.List.Keys;
                }
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
                if (this.hashtable != null) {
                    return this.hashtable.Values; 
                } else {
                    return this.List.Values; 
                } 
            }
        }
	});
	
	HybridDictionary.Type = new Type("HybridDictionary", HybridDictionary, [IDictionary.Type]);
	return HybridDictionary;
});


        // These numbers have been carefully tested to be optimal. Please don't change them 
        // without doing thorough performance testing. 
//        private const int CutoverPoint = 9;
//        private const int InitialHashtableSize = 13; 
//        private const int FixedSizeCutoverPoint = 6;

//        // Instance variables. This keeps the HybridDictionary very light-weight when empty
//        private ListDictionary list; 
//        private Hashtable hashtable;
// 

 
 

