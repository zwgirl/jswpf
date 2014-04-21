/**
 * InputBindingCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList", "generic/List", "internal/InheritanceContextHelper"], 
		function(declare, Type, IList, List, InheritanceContextHelper){
	var InputBindingCollection = declare("InputBindingCollection", IList,{
		constructor:function(par){
//		     private List<InputBinding> 
			this._innerBindingList = null;
//		     private bool  
			this._isReadOnly = false; 
//		     private DependencyObject 
			this._owner = null;
			
			if(par !==undefined){
				if(par instanceof DependencyObject){
					this._owner = par;
				} else{
					if (par != null && par.Count > 0) 
		            {
		                this.AddRange(par instanceof ICollection ? par : null); 
		            } 
				}
			}
		},
		
		
        /// <summary> 
        /// Indexing operator
        /// </summary> 
		Get:function(index)
        { 
            // disable PreSharp warning about throwing exceptions in getter;
            // this is allowed in an indexed property.  (First disable C# 
            // warning about unknown warning numbers.) 
            if (this._innerBindingList != null)
            {
                return this._innerBindingList.Get(index); 
            }
            else 
            { 
                throw new ArgumentOutOfRangeException("index");
            }
        },

        Set:function(index, value)
        { 
            if (this._innerBindingList != null) 
            {
                /*InputBinding*/var oldInputBinding = null; 
                if (index >= 0 && index < this._innerBindingList.Count)
                {
                    oldInputBinding = this._innerBindingList[index];
                } 
                this._innerBindingList.Set(index, value);
                if (oldInputBinding != null) 
                { 
                    InheritanceContextHelper.RemoveContextFromObject(this._owner, oldInputBinding);
                } 
                InheritanceContextHelper.ProvideContextForObject(this._owner, value);
            }
            else
            { 
                throw new ArgumentOutOfRangeException("index");
            } 
        }, 
        
        /// <summary> 
        /// CopyTo - to copy the entire collection into an array
        /// </summary> 
        /// <param name="array">generic object array</param> 
        /// <param name="index"></param>
//        void ICollection.
        CopyTo:function(/*System.Array */array, /*int*/ index) 
        {
            if (this._innerBindingList != null)
            {
            	this._innerBindingList.CopyTo(array, index); 
            }
        },

        /// <summary> 
        /// IList.Contains
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>true - if found, false - otherwise</returns> 
//        bool IList.
        Contains:function(/*object*/ key)
        { 
            return this.Contains(key instanceof InputBinding ? key : null); 
        },
 
        /// <summary>
        /// IndexOf - returns the index of the item in the list
        /// </summary>
        /// <param name="value">item whose index is sought</param> 
        /// <returns>index of the item or -1 </returns>
//        int IList.
        IndexOf:function(/*object*/ value) 
        { 
            var inputBinding = value instanceof InputBinding ? value : null;
            return ((inputBinding != null) ? this.IndexOf(inputBinding) : -1); 
        },

        /// <summary>
        ///  Insert 
        /// </summary>
        /// <param name="index"></param> 
        /// <param name="value"></param> 
//        void IList.
        Insert:function(/*int*/ index, /*object*/ value)
        { 
            this.Insert(index, value instanceof InputBinding ? value : null);
        },

        /// <summary> 
        /// Add - appends the given inputbinding to the current list.
        /// </summary> 
        /// <param name="inputBinding">InputBinding object to add</param> 
//        int IList.
        Add:function(/*object*/ inputBinding)
        { 
            this.Add(inputBinding instanceof InputBinding ? inputBinding : null);
            return 0; // ICollection.Add no longer returns the indice
        },
 
        /// <summary>
        /// Remove - removes the given inputbinding from the current list. 
        /// </summary> 
        /// <param name="inputBinding">InputBinding object to remove</param>
//        void IList.
        Remove:function(/*object*/ inputBinding) 
        {
            this.Remove(inputBinding instanceof InputBinding ? inputBinding : null);
        },
 
        /// <summary>
        /// Add
        /// </summary>
        /// <param name="inputBinding"></param> 
//        public int 
        Add:function(/*InputBinding*/ inputBinding)
        { 
            if (inputBinding != null) 
            {
                if (this._innerBindingList == null) 
                	this._innerBindingList = new List/*<InputBinding>*/(1);

                this._innerBindingList.Add(inputBinding);
                InheritanceContextHelper.ProvideContextForObject(this._owner, inputBinding); 
                return 0; // ICollection.Add no longer returns the indice
            } 
            else 
            {
                throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings)); 
            }
        },
        
        /// <summary> 
        /// IndexOf
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns> 
//        public int 
        IndexOf:function(/*InputBinding*/ value)
        { 
            return (this._innerBindingList != null) ? this._innerBindingList.IndexOf(value) : -1; 
        },
 
        /// <summary>
        /// Adds the elements of the given collection to the end of this list. If
        /// required, the capacity of the list is increased to twice the previous
        /// capacity or the new size, whichever is larger. 
        /// </summary>
        /// <param name="collection">collection to append</param> 
//        public void 
        AddRange:function(/*ICollection*/ collection) 
        {
            if (collection == null) 
            {
                throw new ArgumentNullException("collection");
            }
 
            if ( collection.Count > 0)
            { 
                if (this._innerBindingList == null) 
                	this._innerBindingList = new List/*<InputBinding>*/(collection.Count);
 
                var collectionEnum = collection.GetEnumerator();
                while(collectionEnum.MoveNext())
                {
                    var inputBinding = collectionEnum.Current instanceof InputBinding ? collectionEnum.Current : null; 
                    if (inputBinding != null)
                    { 
                        this._innerBindingList.Add(inputBinding); 
                        InheritanceContextHelper.ProvideContextForObject(_owner, inputBinding);
                    } 
                    else
                    {
                        throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings));
                    } 
                }
            } 
        }, 

        /// <summary> 
        ///  Insert at given index
        /// </summary>
        /// <param name="index">index at which to insert the given item</param>
        /// <param name="inputBinding">inputBinding to insert</param> 
//        public void 
        Insert:function(/*int*/ index, /*InputBinding*/ inputBinding)
        { 
            if (inputBinding == null) 
            {
                throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings)); 
            }

            if (this._innerBindingList != null)
            { 
            	this._innerBindingList.Insert(index, inputBinding);
                InheritanceContextHelper.ProvideContextForObject(this._owner, inputBinding); 
            } 
        },
 
        /// <summary>
        /// Remove
        /// </summary>
        /// <param name="inputBinding"></param> 
//        public void 
        Remove:function(/*InputBinding*/ inputBinding)
        { 
            if (this._innerBindingList != null && inputBinding != null) 
            {
                if (this._innerBindingList.Remove(inputBinding instanceof InputBinding ? inputBinding : null)) 
                {
                    InheritanceContextHelper.RemoveContextFromObject(this._owner, inputBinding);
                }
            } 
        },
 
        /// <summary> 
        /// RemoveAt
        /// </summary> 
        /// <param name="index">index at which the item needs to be removed</param>
//        public void 
        RemoveAt:function(/*int*/ index)
        {
            if (_innerBindingList != null) 
            {
                /*InputBinding*/var oldInputBinding = null; 
                if (index >= 0 && index < this._innerBindingList.Count) 
                {
                    oldInputBinding = this._innerBindingList.Get(index); 
                }
                this._innerBindingList.RemoveAt(index);
                if (oldInputBinding != null)
                { 
                    InheritanceContextHelper.RemoveContextFromObject(this._owner, oldInputBinding);
                } 
            } 
        },
 
  

        /// <summary> 
        /// Clears the Entire InputBindingCollection
        /// </summary> 
//        public void 
        Clear:function() 
        {
            if (this._innerBindingList != null) 
            {
                /*List<InputBinding>*/var oldInputBindings = new List/*<InputBinding>*/(this._innerBindingList);
                this._innerBindingList.Clear();
                this._innerBindingList = null; 
                for/*each*/ (var i=0; i<oldInputBindings.Count; i++) //InputBinding inputBinding in oldInputBindings)
                { 
                    InheritanceContextHelper.RemoveContextFromObject(this._owner, oldInputBindings.Get(i)); 
                }
            } 
        },

        /// <summary> 
        /// IEnumerable.GetEnumerator - For Enumeration purposes
        /// </summary> 
        /// <returns></returns> 
//        public IEnumerator 
        GetEnumerator:function()
        { 
            if (this._innerBindingList != null)
                return this._innerBindingList.GetEnumerator();

            var list = new List/*<InputBinding>*/(0); 
            return list.GetEnumerator();
        }, 
        /// <summary>
        /// Contains 
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>true - if found, false - otherwise</returns>
//        public bool 
        Contains:function(/*InputBinding*/ key) 
        {
            if (this._innerBindingList != null && key != null) 
            { 
                return this._innerBindingList.Contains(key);
            } 

            return false;
        },
 
//        internal InputBinding 
        FindMatch:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs)
        { 
            for (var i = Count - 1; i >= 0; i--)
            { 
                /*InputBinding*/var inputBinding = this.Get(i); 
                if ((inputBinding.Command != null) && (inputBinding.Gesture != null) &&
                    inputBinding.Gesture.Matches(targetElement, inputEventArgs)) 
                {
                    return inputBinding;
                }
            } 

            return null; 
        } 
			
	});
	
	Object.defineProperties(InputBindingCollection.prototype,{
	       /// <summary>
        /// IsFixedSize - if readonly - fixed, else false.
        /// </summary>
//        public bool 
		IsFixedSize: 
        {
            get:function() { return this.IsReadOnly; } 
        }, 

        /// <summary> 
        /// Count
        /// </summary>
//        public int 
		Count:
        { 
            get:function()
            { 
                return (this._innerBindingList != null ? this._innerBindingList.Count : 0); 
            }
        }, 

        /// <summary> 
        /// IList.IsReadOnly - Tells whether this is readonly Collection.
        /// </summary>
//        public bool 
		IsReadOnly:
        { 
            get:function() { return this._isReadOnly; }
        } 
	});
	
	InputBindingCollection.Type = new Type("InputBindingCollection", InputBindingCollection, [IList.Type]);
	return InputBindingCollection;
});
