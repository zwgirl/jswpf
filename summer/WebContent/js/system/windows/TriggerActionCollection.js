/**
 * TriggerActionCollection
 */

define(["dojo/_base/declare", "system/Type", "internal/InheritanceContextHelper"], 
		function(declare, Type, InheritanceContextHelper){
	var TriggerActionCollection = declare("TriggerActionCollection", Collection,{
		constructor:function(){
			this._rawList = new List(); 
			this._sealed = false;
		},
		

		 
        /// <summary>
        ///     IList.Clear 
        /// </summary> 
//        public void 
        Clear:function()
        { 
            this.CheckSealed();

            for (var i = this._rawList.Count - 1; i >= 0; i--)
            { 
                InheritanceContextHelper.RemoveContextFromObject(this._owner, this._rawList[i]);
            } 
 
            this._rawList.Clear();
        }, 

        /// <summary>
        ///     IList.RemoveAt
        /// </summary> 
//        public void 
        RemoveAt:function(/*int*/ index)
        { 
            this.CheckSealed(); 
            /*TriggerAction*/var oldValue = this._rawList[index];
            InheritanceContextHelper.RemoveContextFromObject(this._owner, oldValue); 
            this._rawList.RemoveAt(index);

        },
 
        ///////////////////////////////////////////////////////////////////////
        //  Strongly-typed implementations 
 
        /// <summary>
        ///     IList.Add 
        /// </summary>

//        public void 
        Add:function(/*TriggerAction*/ value)
        { 
        	this.CheckSealed();
            InheritanceContextHelper.ProvideContextForObject( this._owner, value ); 
            this._rawList.Add(value); 
        },
 

        /// <summary>
        ///     IList.Contains
        /// </summary> 
//        public bool 
        Contains:function(/*TriggerAction*/ value)
        { 
            return this._rawList.Contains(value); 
        },
 

        /// <summary> 
        ///     IList.IndexOf
        /// </summary>
//        public int 
        IndexOf:function(/*TriggerAction*/ value)
        { 
            return this._rawList.IndexOf(value);
        },
 
        /// <summary>
        ///     IList.Insert 
        /// </summary>
//        public void 
        Insert:function(/*int*/ index, /*TriggerAction*/ value)
        {
        	this.CheckSealed(); 
            InheritanceContextHelper.ProvideContextForObject(this._owner, value );
            this._rawList.Insert(index, value); 
 
        },
 
        /// <summary>
        ///     IList.Remove
        /// </summary>
//        public bool 
        Remove:function(/*TriggerAction*/ value) 
        {
        	this.CheckSealed(); 
            InheritanceContextHelper.RemoveContextFromObject(this._owner, value); 
            /*bool*/var wasRemoved = this._rawList.Remove(value);
            return wasRemoved; 
        },
        /// <summary> 
        ///     IEnumerable.GetEnumerator
        /// </summary> 
//        public IEnumerator<TriggerAction> 
        GetEnumerator:function()
        { 
            return this._rawList.GetEnumerator();
        },
        
        /// <summary>
        ///     IList.Item 
        /// </summary>
        Get:function(/*int*/ index)
        { 
            return this._rawList.Get(index);
     
        },
        
        Set:function(index, value){
            this.CheckSealed();
            
            var oldValue = this._rawList.Get(index); 
            InheritanceContextHelper.RemoveContextFromObject(this.Owner, oldValue instanceof DependencyObject ? oldValue : null);
            this._rawList[index] = value; 
        }

	});
	
	Object.defineProperties(TriggerActionCollection.prototype,{
	       /// <summary>
        ///     ICollection.Count
        /// </summary>
//        public int 
        Count: 
        {
            get:function() 
            { 
                return this._rawList.Count;
            } 
        },

        /// <summary>
        ///     IList.IsReadOnly 
        /// </summary>
//        public bool 
        IsReadOnly: 
        { 
            get:function()
            { 
                return this._sealed;
            }
        },
        
        
        // The event trigger that we're in
        
//        internal DependencyObject 
        Owner:
        { 
            get:function() { return this._owner; }, 
            set:function(value)
            { 
                this._owner = value;
            }
        } 
	});
	
	TriggerActionCollection.Type = new Type("TriggerActionCollection", TriggerActionCollection, [Collection.Type]);
	return TriggerActionCollection;
});
