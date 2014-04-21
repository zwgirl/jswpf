/**
 * PointCollection
 */

define(["dojo/_base/declare", "system/Type", "windows/Freezable", "utility/FrugalStructList", "collections/IEnumerator",
        "system/IFormattable", "collections/IList", "text/StringBuilder"], 
		function(declare, Type, Freezable, FrugalStructList, IEnumerator,
				IFormattable, IList, StringBuilder){
	
    /// <summary>
    /// Enumerates the items in a PointCollection 
    /// </summary>
//    public struct 
	var Enumerator =declare(IEnumerator, 
    {

        constructor:function(/*PointCollection*/ list) 
        { 
//            Debug.Assert(list != null, "list may not be null.");

            this._list = list;
            this._version = list._version;
            this._index = -1;
            this._current = new Point(); //default(Point); 
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
                	this._current = this._list._collection[++_index]; 
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
//        private Point _current;
//        private PointCollection _list; 
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
//        public Point 
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
    
	var PointCollection = declare("PointCollection", Freezable,{
		constructor:function(){
			if(arguments.length == 0){
				this._collection = new FrugalStructList/*<Point>*/();
			}else if(arguments.length == 1){
				
				if(typeof(arguments[0]) == "number"){
					var capacity = arguments[0];
					this._collection = new FrugalStructList/*<Point>*/(capacity);
				}else{
					var collection = arguments[0];
					
					// The WritePreamble and WritePostscript aren't technically necessary
		            // in the constructor as of 1/20/05 but they are put here in case
		            // their behavior changes at a later date 

		            this.WritePreamble(); 
		 
		            if (collection != null)
		            { 
		                /*ICollection<Point>*/var icollectionOfT = collection instanceof ICollection/*<Point>*/ ? collection : null;
		                if (icollectionOfT != null) 
		                {
		                    this._collection = new FrugalStructList/*<Point>*/(icollectionOfT); 
		                } 
		                else
		                { 
		                    /*ICollection*/var icollection = collection instanceof ICollection ? collection : null;
		                    if (icollection != null) // an IC but not and IC<T>
		                    { 
		                    	this._collection = new FrugalStructList/*<Point>*/(icollection);
		                    } 
		                    else // not a IC or IC<T> so fall back to the slower Add 
		                    {
		                    	this._collection = new FrugalStructList/*<Point>*/(); 

		                        for(var i=0; i<collection.Count; i++) //foreach (Point item in collection)
		                        {
		                        	var item = collection.Get(i);
		                            this._collection.Add(item);
		                        } 
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
		
//		/// <summary> 
//        ///     Shadows inherited Clone() with a strongly typed
//        ///     version for convenience.
//        /// </summary>
////        public new PointCollection 
//		Clone:function() 
//        {
//            return Freezable.prototype.Clone().call(this); 
//        }, 
//
//        /// <summary> 
//        ///     Shadows inherited CloneCurrentValue() with a strongly typed
//        ///     version for convenience.
//        /// </summary>
////        public new PointCollection 
//		CloneCurrentValue:function() 
//        {
//            return Freezable.prototype.CloneCurrentValue.call(this); 
//        }, 
 
        /// <summary>
        ///     Adds "value" to the list 
        /// </summary> 
//        public void 
        Add:function(/*Point*/ value)
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

        	this._collection.Clear();

            ++this._version; 
            this.WritePostscript();
        }, 
 
        /// <summary>
        ///     Determines if the list contains "value" 
        /// </summary>
//        public bool 
        Contains:function(/*Point*/ value)
        {
        	this.ReadPreamble(); 

            return this._collection.Contains(value); 
        }, 

        /// <summary> 
        ///     Returns the index of "value" in the list
        /// </summary>
//        public int 
        IndexOf:function(/*Point*/ value)
        { 
        	this.ReadPreamble();
 
            return this._collection.IndexOf(value); 
        },
 
        /// <summary>
        ///     Inserts "value" into the list at the specified position
        /// </summary>
//        public void 
        Insert:function(/*int*/ index, /*Point*/ value) 
        {
 
 
        	this.WritePreamble();
        	this._collection.Insert(index, value); 


            ++this._version;
            this.WritePostscript(); 
        },
 
        /// <summary> 
        ///     Removes "value" from the list
        /// </summary> 
//        public bool 
        Remove:function(/*Point*/ value)
        {
        	this.WritePreamble();
            var index = this.IndexOf(value); 
            if (index >= 0)
            { 
                // we already have index from IndexOf so instead of using Remove, 
                // which will search the collection a second time, we'll use RemoveAt
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
            this._collection.RemoveAt(index); 


            ++this._version;
 
            // No WritePostScript to avoid firing the Changed event.
        }, 
 

        /// <summary> 
        ///     Indexer for the collection
        /// </summary>
        Get:function(/*index*/)
        { 
        	this.ReadPreamble(); 

            return this._collection[index]; 
        },
        Set:function(index, value)
        {


            this.WritePreamble(); 
            this._collection[ index ] = value; 


            ++this._version;
            this.WritePostscript();
        },
        
		/// <summary> 
		/// Returns an enumerator for the collection 
		/// </summary>
//		public Enumerator 
        GetEnumerator:function() 
		{
		    ReadPreamble();
		
		    return new Enumerator(this); 
		},
 
        /// <summary>
        ///     Copies the elements of the collection into "array" starting at "index" 
        /// </summary> 
//        public void 
		CopyTo:function(/*Point[]*/ array, /*int*/ index)
        { 
			this.ReadPreamble();

            if (array == null)
            { 
                throw new ArgumentNullException("array");
            } 
 
            // This will not throw in the case that we are copying
            // from an empty collection.  This is consistent with the 
            // BCL Collection implementations. (Windows 1587365)
            if (index < 0  || (index + this._collection.Count) > array.Length)
            {
                throw new ArgumentOutOfRangeException("index"); 
            }
 
            this._collection.CopyTo(array, index); 
        },
 
        /// <summary> 
        /// Helper to return read only access.
        /// </summary> 
//        internal Point 
        Internal_GetItem:function(/*int*/ i)
        {
            return this._collection[i];
        }, 

//        private Point 
        Cast:function(/*object*/ value)
        { 
            if( value == null )
            { 
                throw new System.ArgumentNullException("value"); 
            }
 
            if (!(value instanceof Point))
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "Point"));
            } 

            return value; 
        }, 

        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the
        // integer
//        private int 
        AddHelper:function(/*Point*/ value)
        { 
            var index = AddWithoutFiringPublicEvents(value);
 
            // AddAtWithoutFiringPublicEvents incremented the version 

            this.WritePostscript(); 

            return index;
        },
 
//        internal int 
        AddWithoutFiringPublicEvents:function(/*Point*/ value)
        { 
            var index = -1; 

 
            this.WritePreamble();
            index = this._collection.Add(value);

 
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
            return new PointCollection();
        }, 
        /// <summary>
        /// Implementation of Freezable.CloneCore() 
        /// </summary> 
//        protected override void 
        CloneCore:function(/*Freezable*/ source)
        { 
            /*PointCollection*/var sourcePointCollection =  source;

            Freezable.prototype.CloneCore.call(this, source);
 
            var count = sourcePointCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<Point>*/(count); 

            for (var i = 0; i < count; i++) 
            {
            	this._collection.Add(sourcePointCollection._collection[i]);
            }
 
        },
        /// <summary> 
        /// Implementation of Freezable.CloneCurrentValueCore() 
        /// </summary>
//        protected override void 
        CloneCurrentValueCore:function(/*Freezable*/ source) 
        {
            /*PointCollection*/var sourcePointCollection = source;

            Freezable.prototype.CloneCurrentValueCore.call(this, source); 

            var count = sourcePointCollection._collection.Count; 
 
            this._collection = new FrugalStructList/*<Point>*/(count);
 
            for (var i = 0; i < count; i++)
            {
            	this._collection.Add(sourcePointCollection._collection[i]);
            } 

        }, 
        /// <summary> 
        /// Implementation of Freezable.GetAsFrozenCore()
        /// </summary> 
//        protected override void 
        GetAsFrozenCore:function(/*Freezable*/ source)
        {
            /*PointCollection*/var sourcePointCollection = /*(PointCollection)*/ source;
 
            Freezable.prototype.GetAsFrozenCore.call(this, source);
 
            var count = sourcePointCollection._collection.Count; 

            this._collection = new FrugalStructList/*<Point>*/(count); 

            for (var i = 0; i < count; i++)
            {
                this._collection.Add(sourcePointCollection._collection[i]); 
            }
 
        },
        /// <summary>
        /// Implementation of Freezable.GetCurrentValueAsFrozenCore() 
        /// </summary>
//        protected override void 
        GetCurrentValueAsFrozenCore:function(/*Freezable*/ source)
        {
            /*PointCollection*/var sourcePointCollection = source; 

            Freezable.prototype.GetCurrentValueAsFrozenCore.call(this, source); 
 
            var count = sourcePointCollection._collection.Count;
 
            this._collection = new FrugalStructList/*<Point>*/(count);

            for (var i = 0; i < count; i++)
            { 
                this._collection.Add(sourcePointCollection._collection[i]);
            } 
 
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
 
            /*StringBuilder*/var str = new StringBuilder();

            // Consider using this separator
            // Helper to get the numeric list separator for a given culture. 
            // char separator = MS.Internal.TokenizerHelper.GetNumericListSeparator(provider);
 
            for (var i=0; i<this._collection.Count; i++) 
            {
                str.AppendFormat( 
                    "{0}",
                    this._collection.Get(i).ToString());
 
                if (i != this._collection.Count-1)
                { 
                    str.Append(" "); 
                }
            } 

            return str.ToString();
        }
	});
	
	Object.defineProperties(PointCollection.prototype,{
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
//        bool ICollection<Point>.
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
	
	
//	private static PointCollection 
	var s_empty = null;
	Object.defineProperties(PointCollection,{

		 
        /// <summary> 
        /// A frozen empty PointCollection.
        /// </summary> 
//        internal static PointCollection 
		Empty:
        {
            get:function()
            { 
                if (s_empty == null)
                { 
                    /*PointCollection*/var collection = new PointCollection(); 
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
    /// <param name="source"> string with PointCollection data </param> 
    /// </summary>
//    public static PointCollection Parse(string source) 
//    {
//        IFormatProvider formatProvider = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS;
//
//        TokenizerHelper th = new TokenizerHelper(source, formatProvider); 
//        PointCollection resource = new PointCollection();
//
//        Point value; 
//
//        while (th.NextToken()) 
//        {
//            value = new Point(
//                Convert.ToDouble(th.GetCurrentToken(), formatProvider),
//                Convert.ToDouble(th.NextTokenRequired(), formatProvider)); 
//
//            resource.Add(value); 
//        } 
//
//        return resource; 
//    }
	
	PointCollection.Type = new Type("PointCollection", PointCollection, [Freezable.Type, IFormattable.Type, IList.Type]);
	return PointCollection;
});

