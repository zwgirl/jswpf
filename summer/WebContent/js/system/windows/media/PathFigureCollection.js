/**
 * PathFigureCollection
 */
/// <summary>
/// A collection of PathFigure objects.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "animation/Animatable", "system/IFormattable", "collections/IList"], 
		function(declare, Type, Animatable, IFormattable, IList){
    /// <summary> 
    /// Enumerates the items in a PathFigureCollection 
    /// </summary>
//    public struct 
	var Enumerator =declare(IEnumerator, 
    {
        constructor:function(/*PathFigureCollection*/ list) 
        {
//            Debug.Assert(list != null, "list may not be null."); 

            this._list = list;
            this._version = list._version; 
            this._index = -1;
            this._current = null; //default(PathFigure);
            
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
                	this._current = _list._collection[++this._index];
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
        },
//        private PathFigure _current; 
//        private PathFigureCollection _list; 
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
//        public PathFigure 
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
    
	var PathFigureCollection = declare("PathFigureCollection", Animatable,{
		constructor:function(){
			if(arguments.length == 0){
				this._collection = new FrugalStructList/*<PathFigure>*/();
			}else if(arguments.length == 1){
				if(typeof arguments[0] == "number"){
					_collection = new FrugalStructList/*<PathFigure>*/(/*capacity*/arguments[0]);
				}else {
					// The WritePreamble and WritePostscript aren't technically necessary 
		            // in the constructor as of 1/20/05 but they are put here in case
		            // their behavior changes at a later date
					collection = arguments[0];
		            this.WritePreamble(); 

		            if (collection != null) 
		            { 
		                var needsItemValidation = true;
		                /*ICollection*/var icollection = collection instanceof ICollection ? collection : null;
		       		 
	                    if (icollection != null) // an IC but not and IC<T>
	                    {
	                    	this._collection = new FrugalStructList/*<PathFigure>*/(icollection);
	                    } 
	                    else // not a IC or IC<T> so fall back to the slower Add
	                    { 
	                    	this._collection = new FrugalStructList/*<PathFigure>*/(); 

	                        for(var i=0; i<collection.Count; i++) //foreach (PathFigure item in collection) 
	                        {
	                        	var item = collection.Get(i);
	                            if (item == null)
	                            {
	                                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull)); 
	                            }
	                            /*PathFigure*/var newValue = item; 
	                            this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
	                            this._collection.Add(newValue);
	                        }

	                        needsItemValidation = false;
	                    } 
		 
		                if (needsItemValidation) 
		                {
		                	for(var i=0; i<collection.Count; i++) //foreach (PathFigure item in collection) 
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
				}
			}
			
//	        internal FrugalStructList<PathFigure> _collection;
//	        internal uint 
	        this._version = 0; 
		},
		
		 /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed
        ///     version for convenience.
        /// </summary>
//        public new PathFigureCollection 
		Clone:function() 
        {
            return base.Clone(); 
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed
        ///     version for convenience.
        /// </summary>
//        public new PathFigureCollection 
		CloneCurrentValue:function() 
        {
            return base.CloneCurrentValue(); 
        }, 
 
        /// <summary>
        ///     Adds "value" to the list 
        /// </summary> 
//        public void 
        Add:function(/*PathFigure*/ value)
        { 
            AddHelper(value);
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
                OnFreezablePropertyChanged(/* oldValue = */ this._collectionGet(i), /* newValue = */ null); 
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
        Contains:function(/*PathFigure*/ value) 
        {
        	this.ReadPreamble();

            return this._collection.Contains(value); 
        },
 
        /// <summary> 
        ///     Returns the index of "value" in the list
        /// </summary> 
//        public int 
        IndexOf:function(/*PathFigure*/ value)
        {
        	this.ReadPreamble();
 
            return this._collection.IndexOf(value);
        }, 
 
        /// <summary>
        ///     Inserts "value" into the list at the specified position 
        /// </summary>
//        public void 
        Insert:function(/*int*/ index, /*PathFigure*/ value)
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
        Remove:function(/*PathFigure*/ value) 
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

            var oldValue = this._collection[ index ];
 
            this.OnFreezablePropertyChanged(oldValue, null);
 
            this._collection.RemoveAt(index); 

            ++this._version;
 
            // No WritePostScript to avoid firing the Changed event.
        },
      /// <summary> 
        ///     Copies the elements of the collection into "array" starting at "index"
        /// </summary>
//        public void 
        CopyTo:function(/*PathFigure[]*/ array, /*int*/ index)
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
        ///     Indexer for the collection
        /// </summary>
//        public PathFigure this[int index]
//        { 
//
//        },
        Get:function(index)
        { 
        	this.ReadPreamble(); 

            return this._collection[index]; 
        },
        Set:function(index, value)
        {
            if (value == null) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull)); 
            } 

            this.WritePreamble(); 

            if (!Object.ReferenceEquals(this._collection[ index ], value))
            {
            	var oldValue = this._collection[ index ];
                OnFreezablePropertyChanged(oldValue, value); 

                this._collection[ index ] = value;

            }

            ++this._version;
            this.WritePostscript(); 
        },
        
      /// <summary> 
        /// Helper to return read only access.
        /// </summary> 
//        internal PathFigure 
        Internal_GetItem:function(/*int*/ i)
        {
            return this._collectionGet(i);
        }, 

        /// <summary> 
        ///     Freezable collections need to notify their contained Freezables 
        ///     about the change in the InheritanceContext
        /// </summary> 
//        internal override void 
        OnInheritanceContextChangedCore:function(/*EventArgs*/ args)
        {
        	Animatable.prototype.OnInheritanceContextChangedCore.call(this, args);
 
            for (var i=0; i<this.Count; i++)
            { 
            	var inheritanceChild = this._collectionGet(i); 
                if (inheritanceChild!= null && inheritanceChild.InheritanceContext == this)
                { 
                    inheritanceChild.OnInheritanceContextChanged(args);
                }
            }
        },
 
//        private PathFigure 
        Cast:function(/*object*/ value)
        {
            if( value == null )
            { 
                throw new System.ArgumentNullException("value");
            } 
 
            if (!(value instanceof PathFigure))
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "PathFigure"));
            }

            return /*(PathFigure)*/ value; 
        },
 
        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the
        // integer 
//        private int 
        AddHelper:function(/*PathFigure*/ value)
        {
        	var index = this.AddWithoutFiringPublicEvents(value);
 
            // AddAtWithoutFiringPublicEvents incremented the version
 
        	this.WritePostscript(); 

            return index; 
        },

//        internal int
        AddWithoutFiringPublicEvents:function(/*PathFigure*/ value)
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
            return new PathFigureCollection(); 
        },
        /// <summary> 
        /// Implementation of Freezable.CloneCore()
        /// </summary>
//        protected override void 
        CloneCore:function(/*Freezable*/ source)
        { 
        	var sourcePathFigureCollection = source;
 
        	Animatable.prototype.CloneCore.call(this, source); 

            var count = sourcePathFigureCollection._collection.Count; 

            this._collection = new FrugalStructList/*<PathFigure>*/(count);

            for (var i = 0; i < count; i++) 
            {
            	var newValue = sourcePathFigureCollection._collectionGet(i).Clone(); 
            	this.OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                this._collection.Add(newValue);
            }

        },
        /// <summary> 
        /// Implementation of Freezable.CloneCurrentValueCore()
        /// </summary> 
//        protected override void 
        CloneCurrentValueCore:function(/*Freezable*/ source) 
        {
        	var sourcePathFigureCollection = /*(PathFigureCollection) */source; 

        	Animatable.prototype.CloneCurrentValueCore.call(this, source);

            var count = sourcePathFigureCollection._collection.Count; 

            this._collection = new FrugalStructList/*<PathFigure>*/(count); 
 
            for (var i = 0; i < count; i++)
            { 
            	var newValue = /*(PathFigure) */sourcePathFigureCollection._collectionGet(i).CloneCurrentValue();
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
        	var sourcePathFigureCollection = /*(PathFigureCollection)*/ source; 

        	Animatable.prototype.GetAsFrozenCore.call(this, source); 
 
            var count = sourcePathFigureCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<PathFigure>*/(count);

            for (var i = 0; i < count; i++)
            { 
            	var newValue = /*(PathFigure)*/ sourcePathFigureCollection._collectionGet(i).GetAsFrozen();
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
        	var sourcePathFigureCollection = /*(PathFigureCollection)*/ source;
 
        	Animatable.prototype.GetCurrentValueAsFrozenCore.call(this, source);

            var count = sourcePathFigureCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<PathFigure>*/(count);
 
            for (var i = 0; i < count; i++) 
            {
            	var newValue = sourcePathFigureCollection._collectionGet(i).GetCurrentValueAsFrozen(); 
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
                canFreeze &= Freezable.Freeze(this._collectionGet(i), isChecking);
            } 

            return canFreeze;
        },
 
        /// <summary> 
        /// Creates a string representation of this object based on the current culture.
        /// </summary> 
        /// <returns>
        /// A string representation of this object.
        /// </returns>
//        public override string 
        ToString:function() 
        {
        	this.ReadPreamble(); 
            // Delegate to the internal method which implements all ToString calls. 
            return ConvertToString(null /* format string */, null /* format provider */);
        }, 

        /// <summary>
        /// Creates a string representation of this object based on the IFormatProvider
        /// passed in.  If the provider is null, the CurrentCulture is used. 
        /// </summary>
        /// <returns> 
        /// A string representation of this object. 
        /// </returns>
//        public string ToString(IFormatProvider provider) 
//        {
//            ReadPreamble();
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(null /* format string */, provider); 
//        }
 
        /// <summary> 
        /// Creates a string representation of this object based on the format string
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information.
        /// </summary>
        /// <returns> 
        /// A string representation of this object.
        /// </returns> 
//        string IFormattable.ToString(string format, IFormatProvider provider) 
//        {
//            ReadPreamble(); 
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(format, provider);
//        }
 
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

            // Consider using this separator 
            // Helper to get the numeric list separator for a given culture. 
            // char separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
 
            for (var i=0; i<this._collection.Count; i++)
            {
                str.AppendFormat(
                    provider, 
                    "{0}",
                    this._collectionGet(i).ToString()); 
 
                if (i != this._collection.Count-1)
                { 
                    str.Append(" ");
                }
            }
 
            return str.ToString();
        } 
	});
	
	Object.defineProperties(PathFigureCollection.prototype,{

 
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
        
//        bool ICollection<PathFigure>.
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

//    private static PathFigureCollection 
	var s_empty = null;
	
	Object.defineProperties(PathFigureCollection,{

        /// <summary> 
        /// A frozen empty PathFigureCollection.
        /// </summary> 
//        internal static PathFigureCollection 
		Empty:
        {
            get:function()
            { 
                if (s_empty == null)
                { 
                    /*PathFigureCollection*/var collection = new PathFigureCollection(); 
                    collection.Freeze();
                    s_empty = collection; 
                }

                return s_empty;
            } 
        }  
	});
	
    /// <summary> 
    /// Parse - returns an instance converted from the provided string
    /// using the current culture 
    /// <param name="source"> string with PathFigureCollection data </param>
    /// </summary>
//    public static PathFigureCollection 
	Parse = function(/*string*/ source)
    { 
        /*IFormatProvider*/var formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS;

        return MS.Internal.Parsers.ParsePathFigureCollection(source, formatProvider); 
    };
	
	PathFigureCollection.Type = new Type("PathFigureCollection", PathFigureCollection, [Animatable.Type, IFormattable.Type, IList.Type]);
	return PathFigureCollection;
});
