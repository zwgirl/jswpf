/**
 * InputGestureCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList", "collections/ICollection"], 
		function(declare, Type, IList, ICollection){
	var InputGestureCollection = declare("InputGestureCollection", IList,{
		constructor:function(/*IList*/ inputGestures )
        { 
//			private List<InputGesture> 
			this._innerGestureList = null;
//		    private bool           
			this._isReadOnly = false; 
			if(inputGestures === undefined){
				inputGestures = null;
			}
			
            if (inputGestures != null && inputGestures.Count > 0)
            {
                this.AddRange(inputGestures instanceof ICollection ? inputGestures : null);
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
            return this.Contains(key instanceof InputGesture ? key : null) ;
        }, 

        /// <summary> 
        /// IndexOf 
        /// </summary>
        /// <param name="value"></param> 
        /// <returns></returns>
//        int IList.
        IndexOf:function(/*object*/ value)
        {
            /*InputGesture*/var inputGesture = value instanceof InputGesture ? value : null; 
            return ((inputGesture != null) ? this.IndexOf(inputGesture) : -1) ;
        }, 
 
        /// <summary>
        ///  Insert 
        /// </summary>
        /// <param name="index">index at which to insert the item</param>
        /// <param name="value">item value to insert</param>
//        void IList.
        Insert:function(/*int*/ index, /*object*/ value) 
        {
            if (IsReadOnly) 
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection)); 

            this.Insert(index, value instanceof InputGesture ? value : null); 
        },

        /// <summary>
        /// Add 
        /// </summary>
        /// <param name="inputGesture"></param> 
//        int IList.
        Add:function(/*object*/ inputGesture) 
        {
            if (inputGestureIsReadOnly) 
                throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));

            return this.Add(inputGesture instanceof InputGesture ? inputGesture : null);
        }, 

        /// <summary> 
        /// Remove 
        /// </summary>
        /// <param name="inputGesture"></param> 
//        void IList.
        Remove:function(/*object*/ inputGesture)
        {
            if (this.IsReadOnly)
                throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection)); 

            this.Remove(inputGesture instanceof InputGesture ? inputGesture : null); 
        }, 

         /// <summary>
         /// IEnumerable.GetEnumerator - For Enumeration purposes 
         /// </summary>
         /// <returns></returns> 
//         public IEnumerator 
        GetEnumerator:function() 
         {
             if (this._innerGestureList != null) 
                 return this._innerGestureList.GetEnumerator();

             /*List<InputGesture>*/var list = new List/*<InputGesture>*/(0);
             return list.GetEnumerator(); 
         },
         /// <summary> 
         /// Indexing operator
         /// </summary> 
         Get:function(index)
         { 
             return (this._innerGestureList != null ? this._innerGestureList.Get(index) : null);
         },
         
         Set:function(index, value) 
         {
             if (this.IsReadOnly) 
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));

             this.EnsureList();

             if (this._innerGestureList != null)
             { 
            	 this._innerGestureList.Set(index, value); 
             }
         },
 
         /// <summary>
         /// IndexOf
         /// </summary>
         /// <param name="value"></param> 
         /// <returns></returns>
//         public int 
         IndexOf:function(/*InputGesture*/ value) 
         { 
             return (_innerGestureList != null) ? _innerGestureList.IndexOf(value) : -1;
         }, 

         /// <summary>
         /// RemoveAt - Removes the item at given index
         /// </summary> 
         /// <param name="index">index at which item needs to be removed</param>
//         public void 
         RemoveAt:function(/*int*/ index) 
         { 
             if (IsReadOnly)
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection)); 

             if (_innerGestureList != null)
                _innerGestureList.RemoveAt(index);
         }, 
 
        /// <summary>
        /// Add 
        /// </summary>
        /// <param name="inputGesture"></param>
//        public int 
         Add:function(/*InputGesture*/ inputGesture)
        { 
            if (this.IsReadOnly)
            { 
                throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection)); 
            }
 
            if (inputGesture == null)
            {
            	throw new ArgumentNullException("inputGesture");
            } 

            this.EnsureList(); 
            this._innerGestureList.Add(inputGesture); 
            return 0; // ICollection.Add no longer returns the indice
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
            if (this.IsReadOnly)
            {
                throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));
            } 

            if (collection == null) 
                throw new ArgumentNullException("collection"); 

            if( collection.Count > 0) 
            {
                if (this._innerGestureList == null)
                	this._innerGestureList = new List/*<InputGesture>*/(collection.Count);
 
                var collectionEnum = collection.GetEnumerator();
                while(collectionEnum.MoveNext()) 
                { 
                    var inputGesture = collectionEnum.Current instanceof InputGesture ? collectionEnum.Current : null;
                    if (inputGesture != null) 
                    {
                    	this._innerGestureList.Add(inputGesture);
                    }
                    else 
                    {
                        throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputGestures)); 
                    } 
                }
            } 
        },

        /// <summary>
        ///  Insert 
        /// </summary>
        /// <param name="index">index at which to insert the item</param> 
        /// <param name="inputGesture">item value to insert</param> 
//        public void 
        Insert:function(/*int*/ index, /*InputGesture*/ inputGesture)
        { 
            if (this.IsReadOnly)
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));

            if (inputGesture == null) 
                throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputGestures));
 
            if (this._innerGestureList != null) 
            	this._innerGestureList.Insert(index, inputGesture);
        },

        /// <summary> 
        /// Remove
        /// </summary> 
        /// <param name="inputGesture"></param> 
//        public void 
        Remove:function(/*InputGesture*/ inputGesture)
        { 
            if (this.IsReadOnly)
            {
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));
            } 

            if (inputGesture == null) 
	        { 
                throw new ArgumentNullException("inputGesture");
 	        } 

            if (this._innerGestureList != null && this._innerGestureList.Contains(inputGesture))
            {
            	this._innerGestureList.Remove(inputGesture instanceof InputGesture ? inputGesture : null); 
            }
        }, 
 
        /// <summary>
        /// Clears the Entire InputGestureCollection
        /// </summary>
//        public void 
        Clear:function() 
        {
            if (this.IsReadOnly) 
            { 
                 throw new NotSupportedException(SR.Get(SRID.ReadOnlyInputGesturesCollection));
            } 

            if (this._innerGestureList != null)
            {
            	this._innerGestureList.Clear(); 
            	this._innerGestureList = null;
            } 
        }, 

        /// <summary> 
        /// Contains
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>true - if found, false - otherwise</returns> 
//        public bool 
        Contains:function(/*InputGesture*/ key)
        { 
            if (this._innerGestureList != null && key != null) 
            {
               return this._innerGestureList.Contains(key) ; 
            }
            return false;
        },
 
        /// <summary>
        /// CopyTo - to copy the collection starting from given index into an array 
        /// </summary> 
        /// <param name="inputGestures">Array of InputGesture</param>
        /// <param name="index">start index of items to copy</param> 
//        public void 
        CopyTo:function(/*InputGesture[]*/ inputGestures, /*int*/ index)
        {
            if (this._innerGestureList != null)
            	this._innerGestureList.CopyTo(inputGestures, index); 
        },
 
        /// <summary> 
        /// Seal the Collection by setting it as  read-only.
        /// </summary> 
//        public void 
        Seal:function()
        {
        	this._isReadOnly = true;
        }, 

//        private void 
        EnsureList:function() 
        { 
            if (this._innerGestureList == null)
            	this._innerGestureList = new List/*<InputGesture>*/(1); 
        },
 
//        internal InputGesture 
        FindMatch:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs)
        { 
            for (var i = 0; i < Count; i++)
            {
                var inputGesture = this.Get(i);
                if (inputGesture.Matches(targetElement, inputEventArgs)) 
                {
                    return inputGesture; 
                } 
            }
 
            return null;
        }
	});
	
	Object.defineProperties(InputGestureCollection.prototype,{

         /// <summary> 
         /// IsFixedSize - Fixed Capacity if ReadOnly, else false. 
         /// </summary>
//         public bool 
		IsFixedSize: 
		{
			get:function()
			{
                 return this.IsReadOnly; 
			}
        }, 
 

        /// <summary>
        /// IsReadOnly - Tells whether this is readonly Collection.
        /// </summary> 
//        public bool 
		IsReadOnly:
        { 
            get:function() 
            {
                return (this._isReadOnly); 
            }
        },

        /// <summary>
        /// Count 
        /// </summary>
//        public int 
        Count:
        {
            get:function() 
            {
                return (this._innerGestureList != null ? this._innerGestureList.Count : 0 ); 
            } 
        }
 
	});
	
	
	InputGestureCollection.Type = new Type("InputGestureCollection", InputGestureCollection, [IList.Type]);
	return InputGestureCollection;
});
