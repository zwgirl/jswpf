/**
 * GradientStopCollection
 */

define(["dojo/_base/declare", "system/Type", "animation/Animatable", "system/IFormattable",
        "collections/IList"], 
		function(declare, Type, Animatable, IFormattable,
				IList){
	
    /// <summary>
    /// Enumerates the items in a GradientStopCollection
    /// </summary>
//    public struct 
	var Enumerator =declare(IEnumerator, 
    {
        constructor:function(/*GradientStopCollection*/ list)
        { 
//            Debug.Assert(list != null, "list may not be null.");

            this._list = list;
            this._version = list._version; 
            this._index = -1;
            this._current = null; //default(GradientStop); 
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
                	this._current = _list._collection[++_index]; 
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

 
//        private GradientStop _current;
//        private GradientStopCollection _list;
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
//	        public GradientStop
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
//	                    Debug.Assert(_index == -2, "expected -2, got " + _index + "\n");
	                    throw new InvalidOperationException(SR.Get(SRID.Enumerator_ReachedEnd));
	                }
	            } 
	        }
	});
	
//  internal static Color 
	var s_Color = Colors.Transparent; 
//    internal const double 
	var c_Offset = 0.0;
    
	var GradientStopCollection = declare("GradientStopCollection", Animatable,{
		constructor:function(){
			if(arguments.length == 0){
				this._collection = new FrugalStructList/*<GradientStop>*/();
			}else if(arguments.length == 1){
				if(typeof arguments[0] == "number"){
					this._collection = new FrugalStructList/*<GradientStop>*/(capacity);
				}else {
					// The WritePreamble and WritePostscript aren't technically necessary 
		            // in the constructor as of 1/20/05 but they are put here in case
		            // their behavior changes at a later date 
		 
		            this.WritePreamble();
		 
		            if (collection != null)
		            {
		                var needsItemValidation = true;
		                /*ICollection*/var icollection = collection instanceof ICollection ? collection : null;
		       		 
	                    if (icollection != null) // an IC but not and IC<T>
	                    { 
	                    	this._collection = new FrugalStructList/*<GradientStop>*/(icollection); 
	                    }
	                    else // not a IC or IC<T> so fall back to the slower Add 
	                    {
	                        this._collection = new FrugalStructList/*<GradientStop>*/();

	                        for(var i=0; i<collection.Count; i++) //foreach (GradientStop item in collection) 
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
		                	 for(var i=0; i<collection.Count; i++) //foreach (GradientStop item in collection) 
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
			
//	        internal uint 
	        this._version = 0; 
		},
		
		 /// <summary>
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary>
//        public new GradientStopCollection 
		Clone:function()
        { 
            return base.Clone();
        }, 
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary>
//        public new GradientStopCollection 
        CloneCurrentValue:function()
        { 
            return base.CloneCurrentValue();
        }, 

        /// <summary> 
        ///     Adds "value" to the list
        /// </summary> 
//        public void 
        Add:function(/*GradientStop*/ value) 
        {
            this.AddHelper(value); 
        },

        /// <summary>
        ///     Removes all elements from the list 
        /// </summary>
//        public void 
        Clear:function() 
        { 
            WritePreamble();
 
            for (var i = this._collection.Count - 1; i >= 0; i--)
            {
            	this.OnFreezablePropertyChanged(/* oldValue = */ _collection[i], /* newValue = */ null);
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
        Contains:function(/*GradientStop*/ value)
        { 
        	this.ReadPreamble();

            return this._collection.Contains(value);
        }, 

        /// <summary> 
        ///     Returns the index of "value" in the list 
        /// </summary>
//        public int 
        IndexOf:function(/*GradientStop*/ value) 
        {
        	this.ReadPreamble();

            return this._collection.IndexOf(value); 
        },
 
        /// <summary> 
        ///     Inserts "value" into the list at the specified position
        /// </summary> 
//        public void 
        Insert:function(/*int*/ index, /*GradientStop*/ value)
        {
            if (value == null)
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 
 
            this.WritePreamble();
 
            this.nFreezablePropertyChanged(/* oldValue = */ null, /* newValue = */ value);

            this._collection.Insert(index, value);
 

 
            ++this._version; 
            this.WritePostscript();
        }, 

        /// <summary>
        ///     Removes "value" from the list
        /// </summary> 
//        public bool 
        Remove:function(/*GradientStop*/ value)
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
                var oldValue = this._collection.Get(index);
 
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

            var oldValue = this._collection.Get( index );

            this.OnFreezablePropertyChanged(oldValue, null); 

            this._collection.RemoveAt(index); 
 
            ++this._version;

            // No WritePostScript to avoid firing the Changed event. 
        },
        
        /// <summary>
        ///     Indexer for the collection 
        /// </summary>
//        public GradientStop this[int index]
//        {
//  
//        } 
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
        CopyTo:function(/*GradientStop[]*/ array, /*int*/ index)
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
//        internal GradientStop 
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
                var inheritanceChild = this._collection.Get(i); 
                if (inheritanceChild!= null && inheritanceChild.InheritanceContext == this) 
                {
                    inheritanceChild.OnInheritanceContextChanged(args); 
                }
            }
        },

//        private GradientStop 
        Cast:function(/*object*/ value) 
        {
            if( value == null )
            {
                throw new System.ArgumentNullException("value"); 
            }
 
            if (!(value instanceof GradientStop)) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "GradientStop")); 
            }

            return value;
        },

        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the 
        // integer
//        private int 
        AddHelper:function(/*GradientStop*/ value) 
        {
            var index = AddWithoutFiringPublicEvents(value);

            // AddAtWithoutFiringPublicEvents incremented the version 

            this.WritePostscript(); 
 
            return index;
        }, 

//        internal int 
        AddWithoutFiringPublicEvents:function(/*GradientStop*/ value)
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
            return new GradientStopCollection(); 
        },
        
      /// <summary>
        /// Implementation of Freezable.CloneCore() 
        /// </summary>
//        protected override void 
        CloneCore:function(/*Freezable*/ source)
        {
            /*GradientStopCollection*/var sourceGradientStopCollection = source; 

            base.CloneCore(source); 
 
            var count = sourceGradientStopCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<GradientStop>*/(count);

            for (var i = 0; i < count; i++)
            { 
                /*GradientStop*/var newValue = sourceGradientStopCollection._collection[i].Clone();
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
            /*GradientStopCollection*/var sourceGradientStopCollection = source;
 
            base.CloneCurrentValueCore(source);

            var count = sourceGradientStopCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<GradientStop>*/(count);
 
            for (var i = 0; i < count; i++) 
            {
                var newValue = sourceGradientStopCollection._collection.Get(i).CloneCurrentValue(); 
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
            /*GradientStopCollection*/var sourceGradientStopCollection = source;
 
            base.GetAsFrozenCore(source);
 
            var count = sourceGradientStopCollection._collection.Count; 

            this._collection = new FrugalStructList/*<GradientStop>*/(count); 

            for (var i = 0; i < count; i++)
            {
                var newValue = sourceGradientStopCollection._collection.Get(i).GetAsFrozen(); 
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
            /*GradientStopCollection*/var sourceGradientStopCollection = source; 

            base.GetCurrentValueAsFrozenCore(source); 

            var count = sourceGradientStopCollection._collection.Count;

            this._collection = new FrugalStructList/*<GradientStop>*/(count); 

            for (var i = 0; i < count; i++) 
            { 
                /*GradientStop*/var newValue = sourceGradientStopCollection._collection.Get(i).GetCurrentValueAsFrozen();
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
                canFreeze &= Freezable.Freeze(this._collection[i], isChecking); 
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
 
//        /// <summary>
//        /// Creates a string representation of this object based on the IFormatProvider
//        /// passed in.  If the provider is null, the CurrentCulture is used.
//        /// </summary> 
//        /// <returns>
//        /// A string representation of this object. 
//        /// </returns> 
//        public string ToString(IFormatProvider provider)
//        { 
//            ReadPreamble();
//            // Delegate to the internal method which implements all ToString calls.
//            return ConvertToString(null /* format string */, provider);
//        } 
//
//        /// <summary> 
//        /// Creates a string representation of this object based on the format string 
//        /// and IFormatProvider passed in.
//        /// If the provider is null, the CurrentCulture is used. 
//        /// See the documentation for IFormattable for more information.
//        /// </summary>
//        /// <returns>
//        /// A string representation of this object. 
//        /// </returns>
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
 
            if (_collection.Count == 0) 
            {
                return String.Empty; 
            }

            var str = new StringBuilder();
 
            // Consider using this separator
            // Helper to get the numeric list separator for a given culture. 
            // char separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider); 

            for (var i=0; i<_collection.Count; i++) 
            {
                str.AppendFormat(
                    provider,
                    "{0:" + format + "}", 
                    _collection[i]);
 
                if (i != _collection.Count-1) 
                {
                    str.Append(" "); 
                }
            }

            return str.ToString(); 
        }
	});
	
	Object.defineProperties(GradientStopCollection.prototype,{
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
        
//        bool ICollection<GradientStop>.
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
	
//    private static GradientStopCollection 
	var s_empty = null;
	Object.defineProperties(GradientStopCollection,{

        /// <summary> 
        /// A frozen empty GradientStopCollection. 
        /// </summary>
//        internal static GradientStopCollection 
		Empty:
        {
            get:function()
            {
                if (s_empty == null) 
                {
                    /*GradientStopCollection*/var collection = new GradientStopCollection(); 
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
    /// <param name="source"> string with GradientStopCollection data </param> 
    /// </summary>
//    public static GradientStopCollection Parse(string source)
//    {
//        IFormatProvider formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS; 
//
//        TokenizerHelper th = new TokenizerHelper(source, formatProvider); 
//        GradientStopCollection resource = new GradientStopCollection(); 
//
//        GradientStop value; 
//
//        while (th.NextToken())
//        {
//            value = new GradientStop( 
//                Parsers.ParseColor(th.GetCurrentToken(), formatProvider),
//                Convert.ToDouble(th.NextTokenRequired(), formatProvider)); 
//
//            resource.Add(value);
//        } 
//
//        return resource;
//    }
	
	GradientStopCollection.Type = new Type("GradientStopCollection", GradientStopCollection, 
			[Animatable.Type, IFormattable.Type, IList.Type]);
	return GradientStopCollection;
});
