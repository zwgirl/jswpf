package org.summer.view.window;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.FrugalStructList;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.media.animation.Animatable;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;
import org.summer.view.widget.xml.InvalidCastException;

/// <summary> 
    /// A collection of text decoration instances
    /// </summary>
//    [TypeConverter(typeof(TextDecorationCollectionConverter))]
//    [Localizability(LocalizationCategory.None, Readability=Readability.Unreadable)] 
    public /*sealed*/ /*partial*/ class TextDecorationCollection extends Animatable implements IList
    { 
        /// <summary> 
        /// Compare this collection with another TextDecorations.
        /// </summary> 
        /// <param name="textDecorations"> the text decoration collection to be compared </param>
        /// <returns> true if two collections of TextDecorations contain equal TextDecoration objects in the
        /// the same order. false otherwise
        /// </returns> 
        /// <remarks>
        /// The method doesn't check "full" equality as it can not take into account of all the possible 
        /// values associated with the DependencyObject,such as Animation, DataBinding and Attached property. 
        /// It only compares the public properties to serve the specific Framework's needs in inline property
        /// management and Editing serialization. 
        /// </remarks>
//        [FriendAccessAllowed]   // used by Framework
        /*internal*/ public boolean ValueEquals(TextDecorationCollection textDecorations)
        { 
            if (textDecorations == null)
                return false;   // o is either null or not TextDecorations Object 
 
            if (this == textDecorations)
                return true;    // Reference equality. 

            if ( this.Count != textDecorations.Count)
                return false;   // Two counts are different.
 
            // To be considered equal, TextDecorations should be same in the exact order.
            // Order matters because they imply the Z-order of the text decorations on screen. 
            // Same set of text decorations drawn with different orders may have different result. 
            for (int i = 0; i < this.Count; i++)
            { 
                if (!this[i].ValueEquals(textDecorations[i]))
                    return false;
            }
            return true; 
        }
 
        /// <summary> 
        /// Add a collection of text decorations into the current collection
        /// </summary> 
        /// <param name="textDecorations"> The collection to be added </param>
//        [CLSCompliant(false)]
        public void Add(IEnumerable<TextDecoration> textDecorations)
        { 
            if (textDecorations == null)
            { 
                throw new ArgumentNullException("textDecorations"); 
            }
 
            for/*each*/(TextDecoration textDecoration : textDecorations)
            {
                Add(textDecoration);
            } 
        }
        
      //----------------------------------------------------- 
        //
        //  Public Methods
        //
        //----------------------------------------------------- 

//        #region Public Methods 
 
        /// <summary>
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary>
        public /*new*/ TextDecorationCollection Clone()
        { 
            return (TextDecorationCollection)super.Clone();
        } 
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary>
        public /*new*/ TextDecorationCollection CloneCurrentValue()
        { 
            return (TextDecorationCollection)base.CloneCurrentValue();
        } 
 

 

//        #endregion Public Methods

        //------------------------------------------------------ 
        //
        //  Public Properties 
        // 
        //-----------------------------------------------------
 

//        #region IList<T>

        /// <summary> 
        ///     Adds "value" to the list
        /// </summary> 
        public void Add(TextDecoration value) 
        {
            AddHelper(value); 
        }

        /// <summary>
        ///     Removes all elements from the list 
        /// </summary>
        public void Clear() 
        { 
            WritePreamble();
 
            for (int i = _collection.Count - 1; i >= 0; i--)
            {
                OnFreezablePropertyChanged(/* oldValue = */ _collection[i], /* newValue = */ null);
            } 

            _collection.Clear(); 
 
            Debug.Assert(_collection.Count == 0);
 
            ++_version;
            WritePostscript();
        }
 
        /// <summary>
        ///     Determines if the list contains "value" 
        /// </summary> 
        public boolean Contains(TextDecoration value)
        { 
            ReadPreamble();

            return _collection.Contains(value);
        } 

        /// <summary> 
        ///     Returns the index of "value" in the list 
        /// </summary>
        public int IndexOf(TextDecoration value) 
        {
            ReadPreamble();

            return _collection.IndexOf(value); 
        }
 
        /// <summary> 
        ///     Inserts "value" into the list at the specified position
        /// </summary> 
        public void Insert(int index, TextDecoration value)
        {
            if (value == null)
            { 
                throw new /*System.*/ArgumentException(/*SR.Get(SRID.Collection_NoNull)*/);
            } 
 
            WritePreamble();
 
            OnFreezablePropertyChanged(/* oldValue = */ null, /* newValue = */ value);

            _collection.Insert(index, value);
 

 
            ++_version; 
            WritePostscript();
        } 

        /// <summary>
        ///     Removes "value" from the list
        /// </summary> 
        public boolean Remove(TextDecoration value)
        { 
            WritePreamble(); 

            // By design collections "succeed silently" if you attempt to remove an item 
            // not in the collection.  Therefore we need to first verify the old value exists
            // before calling OnFreezablePropertyChanged.  Since we already need to locate
            // the item in the collection we keep the index and use RemoveAt(...) to do
            // the work.  (Windows OS #1016178) 

            // We use the public IndexOf to guard our UIContext since OnFreezablePropertyChanged 
            // is only called conditionally.  IList.IndexOf returns -1 if the value is not found. 
            int index = IndexOf(value);
 
            if (index >= 0)
            {
                TextDecoration oldValue = _collection[index];
 
                OnFreezablePropertyChanged(oldValue, null);
 
                _collection.RemoveAt(index); 

 


                ++_version;
                WritePostscript(); 

                return true; 
            } 

            // Collection_Remove returns true, calls WritePostscript, 
            // increments version, and does UpdateResource if it succeeds

            return false;
        } 

        /// <summary> 
        ///     Removes the element at the specified index 
        /// </summary>
        public void RemoveAt(int index) 
        {
            RemoveAtWithoutFiringPublicEvents(index);

            // RemoveAtWithoutFiringPublicEvents incremented the version 

            WritePostscript(); 
        } 

 
        /// <summary>
        ///     Removes the element at the specified index without firing
        ///     the public Changed event.
        ///     The caller - typically a public method - is responsible for calling 
        ///     WritePostscript if appropriate.
        /// </summary> 
        /*internal*/ public void RemoveAtWithoutFiringPublicEvents(int index) 
        {
            WritePreamble(); 

            TextDecoration oldValue = _collection[ index ];

            OnFreezablePropertyChanged(oldValue, null); 

            _collection.RemoveAt(index); 
 

 

            ++_version;

            // No WritePostScript to avoid firing the Changed event. 
        }
 
 
        /// <summary>
        ///     Indexer for the collection 
        /// </summary>
        public TextDecoration this[int index]
        {
            get 
            {
                ReadPreamble(); 
 
                return _collection[index];
            } 
            set
            {
                if (value == null)
                { 
                    throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                } 
 
                WritePreamble();
 
                if (!Object.ReferenceEquals(_collection[ index ], value))
                {

                    TextDecoration oldValue = _collection[ index ]; 
                    OnFreezablePropertyChanged(oldValue, value);
 
                    _collection[ index ] = value; 

 
                }


                ++_version; 
                WritePostscript();
            } 
        } 

//        #endregion 

//        #region ICollection<T>

        /// <summary> 
        ///     The number of elements contained in the collection.
        /// </summary> 
        public int Count 
        {
            get 
            {
                ReadPreamble();

                return _collection.Count; 
            }
        } 
 
        /// <summary>
        ///     Copies the elements of the collection into "array" starting at "index" 
        /// </summary>
        public void CopyTo(TextDecoration[] array, int index)
        {
            ReadPreamble(); 

            if (array == null) 
            { 
                throw new ArgumentNullException("array");
            } 

            // This will not throw in the case that we are copying
            // from an empty collection.  This is consistent with the
            // BCL Collection implementations. (Windows 1587365) 
            if (index < 0  || (index + _collection.Count) > array.Length)
            { 
                throw new ArgumentOutOfRangeException("index"); 
            }
 
            _collection.CopyTo(array, index);
        }

        boolean ICollection<TextDecoration>.IsReadOnly 
        {
            get 
            { 
                ReadPreamble();
 
                return IsFrozen;
            }
        }
 
//        #endregion
 
//        #region IEnumerable<T> 

        /// <summary> 
        /// Returns an enumerator for the collection
        /// </summary>
        public Enumerator GetEnumerator()
        { 
            ReadPreamble();
 
            return new Enumerator(this); 
        }
 
        IEnumerator<TextDecoration> IEnumerable<TextDecoration>.GetEnumerator()
        {
            return this.GetEnumerator();
        } 

//        #endregion 
 
//        #region IList
 
        boolean IList.IsReadOnly
        {
            get
            { 
                return ((ICollection<TextDecoration>)this).IsReadOnly;
            } 
        } 

        boolean IList.IsFixedSize 
        {
            get
            {
                ReadPreamble(); 

                return IsFrozen; 
            } 
        }
 
        Object IList.this[int index]
        {
            get
            { 
                return this[index];
            } 
            set 
            {
                // Forwards to typed implementation 
                this[index] = Cast(value);
            }
        }
 
        int IList.Add(Object value)
        { 
            // Forward to typed helper 
            return AddHelper(Cast(value));
        } 

        boolean IList.Contains(Object value)
        {
            return Contains(value as TextDecoration); 
        }
 
        int IList.IndexOf(Object value) 
        {
            return IndexOf(value as TextDecoration); 
        }

        void IList.Insert(int index, Object value)
        { 
            // Forward to IList<T> Insert
            Insert(index, Cast(value)); 
        } 

        void IList.Remove(Object value) 
        {
            Remove(value as TextDecoration);
        }
 
//        #endregion
 
//        #region ICollection 

        void ICollection.CopyTo(Array array, int index) 
        {
            ReadPreamble();

            if (array == null) 
            {
                throw new ArgumentNullException("array"); 
            } 

            // This will not throw in the case that we are copying 
            // from an empty collection.  This is consistent with the
            // BCL Collection implementations. (Windows 1587365)
            if (index < 0  || (index + _collection.Count) > array.Length)
            { 
                throw new ArgumentOutOfRangeException("index");
            } 
 
            if (array.Rank != 1)
            { 
                throw new ArgumentException(SR.Get(SRID.Collection_BadRank));
            }

            // Elsewhere in the collection we throw an AE when the type is 
            // bad so we do it here as well to be consistent
            try 
            { 
                int count = _collection.Count;
                for (int i = 0; i < count; i++) 
                {
                    array.SetValue(_collection[i], index + i);
                }
            } 
            catch (InvalidCastException e)
            { 
                throw new ArgumentException(SR.Get(SRID.Collection_BadDestArray, this.GetType().Name), e); 
            }
        } 

        boolean ICollection.IsSynchronized
        {
            get 
            {
                ReadPreamble(); 
 
                return IsFrozen || Dispatcher != null;
            } 
        }

        Object ICollection.SyncRoot
        { 
            get
            { 
                ReadPreamble(); 
                return this;
            } 
        }
//        #endregion

//        #region IEnumerable 

        IEnumerator IEnumerable.GetEnumerator() 
        { 
            return this.GetEnumerator();
        } 

//        #endregion

//        #region Internal Helpers 

        /// <summary> 
        /// A frozen empty TextDecorationCollection. 
        /// </summary>
        /*internal*/ public static TextDecorationCollection Empty 
        {
            get
            {
                if (s_empty == null) 
                {
                    TextDecorationCollection collection = new TextDecorationCollection(); 
                    collection.Freeze(); 
                    s_empty = collection;
                } 

                return s_empty;
            }
        } 

        /// <summary> 
        /// Helper to return read only access. 
        /// </summary>
        /*internal*/ public TextDecoration Internal_GetItem(int i) 
        {
            return _collection[i];
        }
 
        /// <summary>
        ///     Freezable collections need to notify their contained Freezables 
        ///     about the change in the InheritanceContext 
        /// </summary>
        /*internal*/ public /*override*/ void OnInheritanceContextChangedCore(EventArgs args) 
        {
            base.OnInheritanceContextChangedCore(args);

            for (int i=0; i<this.Count; i++) 
            {
                DependencyObject inheritanceChild = _collection[i]; 
                if (inheritanceChild!= null && inheritanceChild.InheritanceContext == this) 
                {
                    inheritanceChild.OnInheritanceContextChanged(args); 
                }
            }
        }
 
//        #endregion
 
//        #region Private Helpers 

        private TextDecoration Cast(Object value) 
        {
            if( value == null )
            {
                throw new System.ArgumentNullException("value"); 
            }
 
            if (!(value is TextDecoration)) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "TextDecoration")); 
            }

            return (TextDecoration) value;
        } 

        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the 
        // integer
        private int AddHelper(TextDecoration value) 
        {
            int index = AddWithoutFiringPublicEvents(value);

            // AddAtWithoutFiringPublicEvents incremented the version 

            WritePostscript(); 
 
            return index;
        } 

        /*internal*/ public int AddWithoutFiringPublicEvents(TextDecoration value)
        {
            int index = -1; 

            if (value == null) 
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 
            WritePreamble();
            TextDecoration newValue = value;
            OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
            index = _collection.Add(newValue); 

 
 
            ++_version;
 
            // No WritePostScript to avoid firing the Changed event.

            return index;
        } 

 
 
//        #endregion Private Helpers
 
        private static TextDecorationCollection s_empty;


//        #region Public Properties 

 
 
//        #endregion Public Properties
 
        //------------------------------------------------------
        //
        //  Protected Methods
        // 
        //------------------------------------------------------
 
//        #region Protected Methods 

        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary>
        /// <returns>The new Freezable.</returns>
        protected /*override*/ Freezable CreateInstanceCore() 
        {
            return new TextDecorationCollection(); 
        } 
        /// <summary>
        /// Implementation of Freezable.CloneCore() 
        /// </summary>
        protected /*override*/ void CloneCore(Freezable source)
        {
            TextDecorationCollection sourceTextDecorationCollection = (TextDecorationCollection) source; 

            base.CloneCore(source); 
 
            int count = sourceTextDecorationCollection._collection.Count;
 
            _collection = new FrugalStructList<TextDecoration>(count);

            for (int i = 0; i < count; i++)
            { 
                TextDecoration newValue = (TextDecoration) sourceTextDecorationCollection._collection[i].Clone();
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                _collection.Add(newValue); 

            } 

        }
        /// <summary>
        /// Implementation of Freezable.CloneCurrentValueCore() 
        /// </summary>
        protected /*override*/ void CloneCurrentValueCore(Freezable source) 
        { 
            TextDecorationCollection sourceTextDecorationCollection = (TextDecorationCollection) source;
 
            base.CloneCurrentValueCore(source);

            int count = sourceTextDecorationCollection._collection.Count;
 
            _collection = new FrugalStructList<TextDecoration>(count);
 
            for (int i = 0; i < count; i++) 
            {
                TextDecoration newValue = (TextDecoration) sourceTextDecorationCollection._collection[i].CloneCurrentValue(); 
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                _collection.Add(newValue);

            } 

        } 
        /// <summary> 
        /// Implementation of Freezable.GetAsFrozenCore()
        /// </summary> 
        protected /*override*/ void GetAsFrozenCore(Freezable source)
        {
            TextDecorationCollection sourceTextDecorationCollection = (TextDecorationCollection) source;
 
            base.GetAsFrozenCore(source);
 
            int count = sourceTextDecorationCollection._collection.Count; 

            _collection = new FrugalStructList<TextDecoration>(count); 

            for (int i = 0; i < count; i++)
            {
                TextDecoration newValue = (TextDecoration) sourceTextDecorationCollection._collection[i].GetAsFrozen(); 
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                _collection.Add(newValue); 
 
            }
 
        }
        /// <summary>
        /// Implementation of Freezable.GetCurrentValueAsFrozenCore()
        /// </summary> 
        protected /*override*/ void GetCurrentValueAsFrozenCore(Freezable source)
        { 
            TextDecorationCollection sourceTextDecorationCollection = (TextDecorationCollection) source; 

            base.GetCurrentValueAsFrozenCore(source); 

            int count = sourceTextDecorationCollection._collection.Count;

            _collection = new FrugalStructList<TextDecoration>(count); 

            for (int i = 0; i < count; i++) 
            { 
                TextDecoration newValue = (TextDecoration) sourceTextDecorationCollection._collection[i].GetCurrentValueAsFrozen();
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                _collection.Add(newValue);

            }
 
        }
        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.FreezeCore">Freezable.FreezeCore</see>. 
        /// </summary>
        protected /*override*/ boolean FreezeCore(boolean isChecking) 
        {
            boolean canFreeze = base.FreezeCore(isChecking);

            int count = _collection.Count; 
            for (int i = 0; i < count && canFreeze; i++)
            { 
                canFreeze &= Freezable.Freeze(_collection[i], isChecking); 
            }
 
            return canFreeze;
        }

//        #endregion ProtectedMethods 

        //----------------------------------------------------- 
        // 
        //  Internal Methods
        // 
        //------------------------------------------------------

//        #region Internal Methods

//        #endregion Internal Methods 

        //----------------------------------------------------- 
        // 
        //  Internal Properties
        // 
        //-----------------------------------------------------

//        #region Internal Properties
 

 
 

//        #endregion Internal Properties 

        //-----------------------------------------------------
        //
        //  Dependency Properties 
        //
        //------------------------------------------------------ 
 
//        #region Dependency Properties
 


//        #endregion Dependency Properties
 
        //-----------------------------------------------------
        // 
        //  Internal Fields 
        //
        //------------------------------------------------------ 

//        #region Internal Fields

 

 
        /*internal*/ public FrugalStructList<TextDecoration> _collection; 
        /*internal*/ public uint _version = 0;
 

//        #endregion Internal Fields

//        #region Enumerator 
        /// <summary>
        /// Enumerates the items in a TextDecorationCollection 
        /// </summary> 
        public class Enumerator implements IEnumerator, IEnumerator<TextDecoration>
        { 
//            #region Constructor

            /*internal*/ public Enumerator(TextDecorationCollection list)
            { 
                Debug.Assert(list != null, "list may not be null.");
 
                _list = list; 
                _version = list._version;
                _index = -1; 
                _current = default(TextDecoration);
            }

//            #endregion 

//            #region Methods 
 
            void IDisposable.Dispose()
            { 

            }

            /// <summary> 
            /// Advances the enumerator to the next element of the collection.
            /// </summary> 
            /// <returns> 
            /// true if the enumerator was successfully advanced to the next element,
            /// false if the enumerator has passed the end of the collection. 
            /// </returns>
            public boolean MoveNext()
            {
                _list.ReadPreamble(); 

                if (_version == _list._version) 
                { 
                    if (_index > -2 && _index < _list._collection.Count - 1)
                    { 
                        _current = _list._collection[++_index];
                        return true;
                    }
                    else 
                    {
                        _index = -2; // -2 indicates "past the end" 
                        return false; 
                    }
                } 
                else
                {
                    throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
                } 
            }
 
            /// <summary> 
            /// Sets the enumerator to its initial position, which is before the
            /// first element in the collection. 
            /// </summary>
            public void Reset()
            {
                _list.ReadPreamble(); 

                if (_version == _list._version) 
                { 
                    _index = -1;
                } 
                else
                {
                    throw new InvalidOperationException(SR.Get(SRID.Enumerator_CollectionChanged));
                } 
            }
 
//            #endregion 

//            #region Properties 

            Object IEnumerator.Current
            {
                get 
                {
                    return this.Current; 
                } 
            }
 
            /// <summary>
            /// Current element
            ///
            /// The behavior of IEnumerable&lt;T>.Current is undefined 
            /// before the first MoveNext and after we have walked
            /// off the end of the list. However, the IEnumerable.Current 
            /// contract requires that we throw exceptions 
            /// </summary>
            public TextDecoration Current 
            {
                get
                {
                    if (_index > -1) 
                    {
                        return _current; 
                    } 
                    else if (_index == -1)
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_NotStarted));
                    }
                    else
                    { 
                        Debug.Assert(_index == -2, "expected -2, got " + _index + "\n");
                        throw new InvalidOperationException(SR.Get(SRID.Enumerator_ReachedEnd)); 
                    } 
                }
            } 

//            #endregion

//            #region Data 
            private TextDecoration _current;
            private TextDecorationCollection _list; 
            private uint _version; 
            private int _index;
//            #endregion 
        }
//        #endregion

//        #region Constructors 

        //------------------------------------------------------ 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------


        /// <summary> 
        /// Initializes a new instance that is empty.
        /// </summary> 
        public TextDecorationCollection() 
        {
            _collection = new FrugalStructList<TextDecoration>(); 
        }

        /// <summary>
        /// Initializes a new instance that is empty and has the specified initial capacity. 
        /// </summary>
        /// <param name="capacity"> int - The number of elements that the new list is initially capable of storing. </param> 
        public TextDecorationCollection(int capacity) 
        {
            _collection = new FrugalStructList<TextDecoration>(capacity); 
        }

        /// <summary>
        /// Creates a TextDecorationCollection with all of the same elements as collection 
        /// </summary>
        public TextDecorationCollection(IEnumerable<TextDecoration> collection) 
        { 
            // The WritePreamble and WritePostscript aren't technically necessary
            // in the constructor as of 1/20/05 but they are put here in case 
            // their behavior changes at a later date

            WritePreamble();
 
            if (collection != null)
            { 
                boolean needsItemValidation = true; 
                ICollection<TextDecoration> icollectionOfT = collection as ICollection<TextDecoration>;
 
                if (icollectionOfT != null)
                {
                    _collection = new FrugalStructList<TextDecoration>(icollectionOfT);
                } 
                else
                { 
                    ICollection icollection = collection as ICollection; 

                    if (icollection != null) // an IC but not and IC<T> 
                    {
                        _collection = new FrugalStructList<TextDecoration>(icollection);
                    }
                    else // not a IC or IC<T> so fall back to the slower Add 
                    {
                        _collection = new FrugalStructList<TextDecoration>(); 
 
                        foreach (TextDecoration item in collection)
                        { 
                            if (item == null)
                            {
                                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                            } 
                            TextDecoration newValue = item;
                            OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                            _collection.Add(newValue); 

                        } 

                        needsItemValidation = false;
                    }
                } 

                if (needsItemValidation) 
                { 
                    foreach (TextDecoration item in collection)
                    { 
                        if (item == null)
                        {
                            throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                        } 
                        OnFreezablePropertyChanged(/* oldValue = */ null, item);
 
                    } 
                }
 

                WritePostscript();
            }
            else 
            {
                throw new ArgumentNullException("collection"); 
            } 
        }
 
//        #endregion Constructors
    } 