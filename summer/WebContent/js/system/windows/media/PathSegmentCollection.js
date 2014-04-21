/**
 * PathSegmentCollection
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable", "collections/IList", "text/StringBuilder"], 
		function(declare, Type, Animatable, IList, StringBuilder){
	
	/// <summary>
    /// Enumerates the items in a PathSegmentCollection 
    /// </summary> 
//    public struct 
	var Enumerator =declare(IEnumerator, 
    { 

        constructor:function(/*PathSegmentCollection*/ list)
        { 
//            Debug.Assert(list != null, "list may not be null.");

            this._list = list; 
            this._version = list._version;
            this._index = -1; 
            this._current = null; //default(PathSegment);
        },

//        void IDisposable.
        Dispose:function()
        { 

        },

        /// <summary> 
        /// Advances the enumerator to the next element of the collection.
        /// </summary> 
        /// <returns> 
        /// true if the enumerator was successfully advanced to the next element,
        /// false if the enumerator has passed the end of the collection. 
        /// </returns>
//        public bool 
        MoveNext:function()
        {
        	this._list.ReadPreamble(); 

            if (this._version == this._list._version) 
            { 
                if (this._index > -2 && this._index < this._list._collection.Count - 1)
                { 
                	this._current = this._list._collection.Get(++this._index);
                    return true;
                }
                else 
                {
                	this._index = -2; // -2 indicates "past the end" 
                    return false; 
                }
            } 
            else
            {
                throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
            } 
        },

        /// <summary> 
        /// Sets the enumerator to its initial position, which is before the
        /// first element in the collection. 
        /// </summary>
//        public void 
        Reset:function()
        {
        	this._list.ReadPreamble(); 

            if (this._version == this._list._version) 
            { 
            	this._index = -1;
            } 
            else
            {
                throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
            } 
        }


//        private PathSegment _current;
//        private PathSegmentCollection _list; 
//        private uint _version; 
//        private int _index;
    });
	
	Object.defineProperties(Enumerator.prototype, {

        /// <summary>
        /// Current element
        ///
        /// The behavior of IEnumerable&lt;T>.Current is undefined 
        /// before the first MoveNext and after we have walked
        /// off the end of the list. However, the IEnumerable.Current 
        /// contract requires that we throw exceptions 
        /// </summary>
//        public PathSegment 
		Current: 
        {
            get:function()
            {
                if (this._index > -1) 
                {
                    return this._current; 
                } 
                else if (this._index == -1)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.Enumerator_NotStarted));
                }
                else
                { 
//                    Debug.Assert(_index == -2, "expected -2, got " + _index + "\n");
                    throw new InvalidOperationException(SR.Get(SRID.Enumerator_ReachedEnd)); 
                } 
            }
        } 
	});
    
	var PathSegmentCollection = declare("PathSegmentCollection", Animatable,{
		constructor:function(){
			if(typeof arguments[0] == "number"){
				this._collection = new FrugalStructList/*<PathSegment>*/(arguments[0]); 
			}else if(arguments[0] instanceof IEnumerable){
				// The WritePreamble and WritePostscript aren't technically necessary
	            // in the constructor as of 1/20/05 but they are put here in case 
	            // their behavior changes at a later date
				
				collection = arguments[0];

				this.WritePreamble();
	 
	            if (collection != null)
	            { 
	            	var icollection = collection instanceof ICollection ? icollection : null; 

                    if (icollection != null) // an IC but not and IC<T> 
                    {
                        this._collection = new FrugalStructList/*<PathSegment>*/(icollection);
                    }
                    else // not a IC or IC<T> so fall back to the slower Add 
                    {
                        this._collection = new FrugalStructList/*<PathSegment>*/(); 
 
                        for(var i=0; i<collection.Count; i++) //foreach (PathSegment item in collection)
                        { 
                        	var item = collection.Get(i);
                            if (item == null)
                            {
                                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                            } 
                            var newValue = item;
                            this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                            this._collection.Add(newValue); 

                        } 

                        needsItemValidation = false;
                    } 

	                if (needsItemValidation) 
	                { 
	                	for(var i=0; i<collection.Count; i++) //foreach (PathSegment item in collection)
                        { 
                        	var item = collection.Get(i);
	                        if (item == null)
	                        {
	                            throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
	                        } 
	                        this.OnFreezablePropertyChanged(/* oldValue = */ null, item);
	 
	                    } 
	                }
	 

	                this.WritePostscript();
	            }
	            else 
	            {
	                throw new ArgumentNullException("collection"); 
	            } 
			}else{
				this._collection = new FrugalStructList/*<PathSegment>*/(); 
			}
			
//	        internal uint 
			this._version = 0;

		},

        /// <summary> 
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in.
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns> 
        /// A string representation of this object. 
        /// </returns>
//        internal string 
		ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
            if (_collection.Count == 0)
            {
                return String.Empty; 
            }
 
            var str = new StringBuilder(); 

            for (var i=0; i<this._collection.Count; i++) 
            {
                str.Append(this._collection.Get(i).ConvertToString(format, provider));
            }
 
            return str.ToString();
        },
		
		/// <summary>
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary>
//        public new PathSegmentCollection 
		Clone:function()
        { 
            return base.Clone();
        }, 
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary>
//        public new PathSegmentCollection 
        CloneCurrentValue:function()
        { 
            return base.CloneCurrentValue();
        }, 

        /// <summary> 
        ///     Adds "value" to the list
        /// </summary> 
//        public void 
        Add:function(/*PathSegment*/ value) 
        {
            this.AddHelper(value); 
        },

        /// <summary>
        ///     Removes all elements from the list 
        /// </summary>
//        public void 
        Clear:function() 
        { 
            this.WritePreamble();
 
            for (var i = this._collection.Count - 1; i >= 0; i--)
            {
            	this.OnFreezablePropertyChanged(/* oldValue = */ this._collection.Get(i), /* newValue = */ null);
            } 

            this._collection.Clear(); 
 
//            Debug.Assert(_collection.Count == 0);
 
            ++this._version;
            this.WritePostscript();
        },
 
        /// <summary>
        ///     Determines if the list contains "value" 
        /// </summary> 
//        public bool 
        Contains:function(/*PathSegment*/ value)
        { 
        	this.ReadPreamble();

            return this._collection.Contains(value);
        }, 

        /// <summary> 
        ///     Returns the index of "value" in the list 
        /// </summary>
//        public int 
        IndexOf:function(/*PathSegment*/ value) 
        {
        	this.ReadPreamble();

            return this._collection.IndexOf(value); 
        },
 
        /// <summary> 
        ///     Inserts "value" into the list at the specified position
        /// </summary> 
//        public void 
        Insert:function(/*int*/ index, /*PathSegment*/ value)
        {
            if (value == null)
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 
 
            this.WritePreamble();
 
            this.OnFreezablePropertyChanged(/* oldValue = */ null, /* newValue = */ value);

            this._collection.Insert(index, value);
 
            ++this._version; 
            this.WritePostscript();
        }, 

        /// <summary>
        ///     Removes "value" from the list
        /// </summary> 
//        public bool 
        Remove:function(/*PathSegment*/ value)
        { 
        	this.WritePreamble(); 

            // By design collections "succeed silently" if you attempt to remove an item 
            // not in the collection.  Therefore we need to first verify the old value exists
            // before calling OnFreezablePropertyChanged.  Since we already need to locate
            // the item in the collection we keep the index and use RemoveAt(...) to do
            // the work.  (Windows OS #1016178) 

            // We use the public IndexOf to guard our UIContext since OnFreezablePropertyChanged 
            // is only called conditionally.  IList.IndexOf returns -1 if the value is not found. 
            var index = this.IndexOf(value);
 
            if (index >= 0)
            {
                var oldValue = this._collection[index];
 
                this.OnFreezablePropertyChanged(oldValue, null);
 
                this._collection.RemoveAt(index); 

                ++this._version;
                this.WritePostscript(); 

                return true; 
            } 

            // Collection_Remove returns true, calls WritePostscript, 
            // increments version, and does UpdateResource if it succeeds

            return false;
        }, 

        /// <summary> 
        ///     Removes the element at the specified index 
        /// </summary>
//        public void 
        RemoveAt:function(/*int*/ index) 
        {
        	this.RemoveAtWithoutFiringPublicEvents(index);

            // RemoveAtWithoutFiringPublicEvents incremented the version 

        	this.WritePostscript(); 
        },

 
        /// <summary>
        ///     Removes the element at the specified index without firing
        ///     the public Changed event.
        ///     The caller - typically a public method - is responsible for calling 
        ///     WritePostscript if appropriate.
        /// </summary> 
//        internal void 
        RemoveAtWithoutFiringPublicEvents:function(/*int*/ index) 
        {
        	this.WritePreamble(); 

            var oldValue = this._collection.Get(index);

            this.OnFreezablePropertyChanged(oldValue, null); 

            this._collection.RemoveAt(index); 

            ++this._version;

            // No WritePostScript to avoid firing the Changed event. 
        },
 
 
        /// <summary>
        ///     Indexer for the collection 
        /// </summary>
//        public PathSegment this[int index]
//        {
//
//        },
        
        Get:function(index) 
        {
        	this.ReadPreamble(); 

            return this._collection.Get(index);
        }, 
        Set:function(index, value)
        {
            if (value == null)
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 

            this.WritePreamble();

            if (!Object.ReferenceEquals(this._collection.Get(index), value))
            {

                var oldValue = this._collection.Get(index); 
                this.OnFreezablePropertyChanged(oldValue, value);

                this._collection.Set(index, value); 

            }
            ++this._version; 
            this.WritePostscript();
        }, 
        
        /// <summary>
        ///     Copies the elements of the collection into "array" starting at "index" 
        /// </summary>
//        public void 
        CopyTo:function(/*PathSegment[]*/ array, /*int*/ index)
        {
            this.ReadPreamble(); 

            if (array == null) 
            { 
                throw new ArgumentNullException("array");
            } 

            // This will not throw in the case that we are copying
            // from an empty collection.  This is consistent with the
            // BCL Collection implementations. (Windows 1587365) 
            if (index < 0  || (index + this._collection.Count) > array.length)
            { 
                throw new ArgumentOutOfRangeException("index"); 
            }
 
            this._collection.CopyTo(array, index);
        },

        /// <summary> 
        /// Returns an enumerator for the collection
        /// </summary>
//        public Enumerator 
        GetEnumerator:function()
        { 
            this.ReadPreamble();
 
            return new Enumerator(this); 
        },

        /// <summary> 
        /// Helper to return read only access. 
        /// </summary>
//        internal PathSegment 
        Internal_GetItem:function(/*int*/ i) 
        {
            return this._collection.Get(i);
        },
 
        /// <summary>
        ///     Freezable collections need to notify their contained Freezables 
        ///     about the change in the InheritanceContext 
        /// </summary>
//        internal override void 
        OnInheritanceContextChangedCore:function(/*EventArgs*/ args) 
        {
            base.OnInheritanceContextChangedCore(args);

            for (var i=0; i<this.Count; i++) 
            {
                var inheritanceChild = this._collection[i]; 
                if (inheritanceChild!= null && inheritanceChild.InheritanceContext == this) 
                {
                    inheritanceChild.OnInheritanceContextChanged(args); 
                }
            }
        },

//        private PathSegment 
        Cast:function(/*object*/ value) 
        {
            if( value == null )
            {
                throw new System.ArgumentNullException("value"); 
            }
 
            if (!(value instanceof PathSegment)) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "PathSegment")); 
            }

            return value;
        }, 

        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the 
        // integer
//        private int 
        AddHelper:function(/*PathSegment*/ value) 
        {
            var index = this.AddWithoutFiringPublicEvents(value);

            // AddAtWithoutFiringPublicEvents incremented the version 

            this.WritePostscript(); 
 
            return index;
        }, 

//        internal int 
        AddWithoutFiringPublicEvents:function(/*PathSegment*/ value)
        {
            var index = -1; 

            if (value == null) 
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 
            this.WritePreamble();
            var newValue = value;
            this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
            index = this._collection.Add(newValue); 
 
            ++this._version;
 
            // No WritePostScript to avoid firing the Changed event.

            return index;
        },
        
      /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary>
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function() 
        {
            return new PathSegmentCollection(); 
        }, 
        /// <summary>
        /// Implementation of Freezable.CloneCore() 
        /// </summary>
//        protected override void 
        CloneCore:function(/*Freezable*/ source)
        {
            /*PathSegmentCollection*/var sourcePathSegmentCollection = source; 

            base.CloneCore(source); 
 
            var count = sourcePathSegmentCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<PathSegment>*/(count);

            for (var i = 0; i < count; i++)
            { 
            	var newValue = sourcePathSegmentCollection._collection.Get(i).Clone();
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                this._collection.Add(newValue); 

            } 

        },
        /// <summary>
        /// Implementation of Freezable.CloneCurrentValueCore() 
        /// </summary>
//        protected override void 
        CloneCurrentValueCore:function(/*Freezable*/ source) 
        { 
        	var sourcePathSegmentCollection = source;
 
            base.CloneCurrentValueCore(source);

            var count = sourcePathSegmentCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<PathSegment>*/(count);
 
            for (var i = 0; i < count; i++) 
            {
                var newValue = sourcePathSegmentCollection._collection.Get(i).CloneCurrentValue(); 
                this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                this._collection.Add(newValue);

            } 

        },
        /// <summary> 
        /// Implementation of Freezable.GetAsFrozenCore()
        /// </summary> 
//        protected override void 
        GetAsFrozenCore:function(/*Freezable*/ source)
        {
        	var sourcePathSegmentCollection = source;
 
            base.GetAsFrozenCore(source);
 
            var count = sourcePathSegmentCollection._collection.Count; 

            this._collection = new FrugalStructList/*<PathSegment>*/(count); 

            for (var i = 0; i < count; i++)
            {
            	var newValue = sourcePathSegmentCollection._collection.Get(i).GetAsFrozen(); 
            	this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
            	this._collection.Add(newValue); 
 
            }
 
        },
        /// <summary>
        /// Implementation of Freezable.GetCurrentValueAsFrozenCore()
        /// </summary> 
//        protected override void 
        GetCurrentValueAsFrozenCore:function(/*Freezable*/ source)
        { 
        	var sourcePathSegmentCollection = source; 

            base.GetCurrentValueAsFrozenCore(source); 

            var count = sourcePathSegmentCollection._collection.Count;

            this._collection = new FrugalStructList/*<PathSegment>*/(count); 

            for (var i = 0; i < count; i++) 
            { 
            	var newValue = sourcePathSegmentCollection._collection.Get(i).GetCurrentValueAsFrozen();
            	this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
            	this._collection.Add(newValue);

            }
 
        },
        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.FreezeCore">Freezable.FreezeCore</see>. 
        /// </summary>
//        protected override bool 
        FreezeCore:function(/*bool*/ isChecking) 
        {
        	var canFreeze = base.FreezeCore(isChecking);

        	var count = this._collection.Count; 
            for (var i = 0; i < count && canFreeze; i++)
            { 
                canFreeze &= Freezable.Freeze(this._collection.Get(i), isChecking); 
            }
 
            return canFreeze;
        },
        
        /// <summary> 
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in.
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information. 
        /// </summary>
        /// <returns> 
        /// A string representation of this object. 
        /// </returns>
//        internal string 
        ConvertToString:function(/*string*/ format, /*IFormatProvider*/ provider) 
        {
            if (this._collection.Count == 0)
            {
                return String.Empty; 
            }
 
            var str = new StringBuilder(); 

            for (var i=0; i<this._collection.Count; i++) 
            {
                str.Append(this._collection.Get(i).ConvertToString(format, provider));
            }
 
            return str.ToString();
        } 
	});
	
	Object.defineProperties(PathSegmentCollection.prototype,{
        /// <summary> 
        ///     The number of elements contained in the collection.
        /// </summary> 
//        public int 
		Count: 
        {
            get:function() 
            {
            	this.ReadPreamble();

                return this._collection.Count; 
            }
        },
        
//        bool ICollection<PathSegment>.
        IsReadOnly: 
        {
            get:function() 
            { 
                this.ReadPreamble();
 
                return this.IsFrozen;
            }
        },
        
//        bool IList.
        IsFixedSize: 
        {
            get:function()
            {
            	this.ReadPreamble(); 

                return this.IsFrozen; 
            } 
        }
	});
	
//    private static PathSegmentCollection 
	var s_empty = null;
	Object.defineProperties(PathSegmentCollection,{
		 /// <summary> 
        /// A frozen empty PathSegmentCollection. 
        /// </summary>
//        internal static PathSegmentCollection 
		Empty: 
        {
            get:function()
            {
                if (s_empty == null) 
                {
                    var collection = new PathSegmentCollection(); 
                    collection.Freeze(); 
                    s_empty = collection;
                } 

                return s_empty;
            }
        }   
	});
	
	PathSegmentCollection.Type = new Type("PathSegmentCollection", PathSegmentCollection, [Animatable.Type, IList.Type]);
	return PathSegmentCollection;
});
