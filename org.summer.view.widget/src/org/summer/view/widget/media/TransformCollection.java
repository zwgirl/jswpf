package org.summer.view.widget.media;

import java.lang.reflect.Array;

import javax.xml.crypto.dsig.Transform;

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
    /// A collection of Transform objects.
    /// </summary> 

 
    public /*sealed*/ /*partial*/ class TransformCollection extends Animatable implements IList, IList<Transform> 
    {
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
        public /*new*/ TransformCollection Clone()
        { 
            return (TransformCollection)super.Clone();
        } 
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary>
        public /*new*/ TransformCollection CloneCurrentValue()
        { 
            return (TransformCollection)super.CloneCurrentValue();
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
        public void Add(Transform value) 
        {
            AddHelper(value); 
        }

        /// <summary>
        ///     Removes all elements from the list 
        /// </summary>
        public void Clear() 
        { 
            WritePreamble();
 
            // As part of Clear()'ing the collection, we will iterate it and call
            // OnFreezablePropertyChanged and OnRemove for each item.
            // However, OnRemove assumes that the item to be removed has already been
            // pulled from the underlying collection.  To statisfy this condition, 
            // we store the old collection and clear _collection before we call these methods.
            // As Clear() semantics do not include TrimToFit behavior, we create the new 
            // collection storage at the same size as the previous.  This is to provide 
            // as close as possible the same perf characteristics as less complicated collections.
            FrugalStructList<Transform> oldCollection = _collection; 
            _collection = new FrugalStructList<Transform>(_collection.Capacity);

            for (int i = oldCollection.Count - 1; i >= 0; i--)
            { 
                OnFreezablePropertyChanged(/* oldValue = */ oldCollection[i], /* newValue = */ null);
 
                // Fire the OnRemove handlers for each item.  We're not ensuring that 
                // all OnRemove's get called if a resumable exception is thrown.
                // At this time, these call-outs are not public, so we do not handle exceptions. 
                OnRemove( /* oldValue */ oldCollection[i]);
            }

            ++_version; 
            WritePostscript();
        } 
 
        /// <summary>
        ///     Determines if the list contains "value" 
        /// </summary>
        public boolean Contains(Transform value)
        {
            ReadPreamble(); 

            return _collection.Contains(value); 
        } 

        /// <summary> 
        ///     Returns the index of "value" in the list
        /// </summary>
        public int IndexOf(Transform value)
        { 
            ReadPreamble();
 
            return _collection.IndexOf(value); 
        }
 
        /// <summary>
        ///     Inserts "value" into the list at the specified position
        /// </summary>
        public void Insert(int index, Transform value) 
        {
            if (value == null) 
            { 
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            } 

            WritePreamble();

            OnFreezablePropertyChanged(/* oldValue = */ null, /* newValue = */ value); 

            _collection.Insert(index, value); 
            OnInsert(value); 

 
            ++_version;
            WritePostscript();
        }
 
        /// <summary>
        ///     Removes "value" from the list 
        /// </summary> 
        public boolean Remove(Transform value)
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
                Transform oldValue = _collection[index]; 
 
                OnFreezablePropertyChanged(oldValue, null);
 
                _collection.RemoveAt(index);

                OnRemove(oldValue);
 

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
 
            Transform oldValue = _collection[ index ];
 
            OnFreezablePropertyChanged(oldValue, null); 

            _collection.RemoveAt(index); 

            OnRemove(oldValue);

 
            ++_version;
 
            // No WritePostScript to avoid firing the Changed event. 
        }
 

        /// <summary>
        ///     Indexer for the collection
        /// </summary> 
        public Transform this[int index]
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
 
                    Transform oldValue = _collection[ index ]; 
                    OnFreezablePropertyChanged(oldValue, value);
 
                    _collection[ index ] = value;

                    OnSet(oldValue, value);
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
        public void CopyTo(Transform[] array, int index)
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
 
        boolean ICollection<Transform>.IsReadOnly 
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

        IEnumerator<Transform> IEnumerable<Transform>.GetEnumerator() 
        {
            return this.GetEnumerator(); 
        } 

//        #endregion 

//        #region IList

        boolean IList.IsReadOnly 
        {
            get 
            { 
                return ((ICollection<Transform>)this).IsReadOnly;
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
            return Contains(value as Transform); 
        }
 
        int IList.IndexOf(Object value)
        {
            return IndexOf(value as Transform);
        } 

        void IList.Insert(int index, Object value) 
        { 
            // Forward to IList<T> Insert
            Insert(index, Cast(value)); 
        }

        void IList.Remove(Object value)
        { 
            Remove(value as Transform);
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
        /// A frozen empty TransformCollection.
        /// </summary>
        /*internal*/ public static TransformCollection Empty
        { 
            get
            { 
                if (s_empty == null) 
                {
                    TransformCollection collection = new TransformCollection(); 
                    collection.Freeze();
                    s_empty = collection;
                }
 
                return s_empty;
            } 
        } 

        /// <summary> 
        /// Helper to return read only access.
        /// </summary>
        /*internal*/ public Transform Internal_GetItem(int i)
        { 
            return _collection[i];
        } 
 
        /// <summary>
        ///     Freezable collections need to notify their contained Freezables 
        ///     about the change in the InheritanceContext
        /// </summary>
        /*internal*/ public /*override*/ void OnInheritanceContextChangedCore(EventArgs args)
        { 
            super.OnInheritanceContextChangedCore(args);
 
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

        private Transform Cast(Object value)
        { 
            if( value == null )
            { 
                throw new System.ArgumentNullException("value"); 
            }
 
            if (!(value is Transform))
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, this.GetType().Name, value.GetType().Name, "Transform"));
            } 

            return (Transform) value; 
        } 

        // IList.Add returns int and IList<T>.Add does not. This 
        // is called by both Adds and IList<T>'s just ignores the
        // integer
        private int AddHelper(Transform value)
        { 
            int index = AddWithoutFiringPublicEvents(value);
 
            // AddAtWithoutFiringPublicEvents incremented the version 

            WritePostscript(); 

            return index;
        }
 
        /*internal*/ public int AddWithoutFiringPublicEvents(Transform value)
        { 
            int index = -1; 

            if (value == null) 
            {
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
            }
            WritePreamble(); 
            Transform newValue = value;
            OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
            index = _collection.Add(newValue); 
            OnInsert(newValue);
 

            ++_version;

            // No WritePostScript to avoid firing the Changed event. 

            return index; 
        } 

        /*internal*/ public /*event*/ ItemInsertedHandler ItemInserted; 
        /*internal*/ public /*event*/ ItemRemovedHandler ItemRemoved;

        private void OnInsert(Object item)
        { 
            if (ItemInserted != null)
            { 
                ItemInserted(this, item); 
            }
        } 

        private void OnRemove(Object oldValue)
        {
            if (ItemRemoved != null) 
            {
                ItemRemoved(this, oldValue); 
            } 
        }
 
        private void OnSet(Object oldValue, Object newValue)
        {
            OnInsert(newValue);
            OnRemove(oldValue); 
        }
 
//        #endregion Private Helpers 

        private static TransformCollection s_empty; 


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
            return new TransformCollection();
        } 
        /// <summary> 
        /// Implementation of Freezable.CloneCore()
        /// </summary> 
        protected /*override*/ void CloneCore(Freezable source)
        {
            TransformCollection sourceTransformCollection = (TransformCollection) source;
 
            super.CloneCore(source);
 
            int count = sourceTransformCollection._collection.Count; 

            _collection = new FrugalStructList<Transform>(count); 

            for (int i = 0; i < count; i++)
            {
                Transform newValue = (Transform) sourceTransformCollection._collection[i].Clone(); 
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                _collection.Add(newValue); 
                OnInsert(newValue); 
            }
 
        }
        /// <summary>
        /// Implementation of Freezable.CloneCurrentValueCore()
        /// </summary> 
        protected /*override*/ void CloneCurrentValueCore(Freezable source)
        { 
            TransformCollection sourceTransformCollection = (TransformCollection) source; 

            super.CloneCurrentValueCore(source); 

            int count = sourceTransformCollection._collection.Count;

            _collection = new FrugalStructList<Transform>(count); 

            for (int i = 0; i < count; i++) 
            { 
                Transform newValue = (Transform) sourceTransformCollection._collection[i].CloneCurrentValue();
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                _collection.Add(newValue);
                OnInsert(newValue);
            }
 
        }
        /// <summary> 
        /// Implementation of Freezable.GetAsFrozenCore() 
        /// </summary>
        protected /*override*/ void GetAsFrozenCore(Freezable source) 
        {
            TransformCollection sourceTransformCollection = (TransformCollection) source;

            super.GetAsFrozenCore(source); 

            int count = sourceTransformCollection._collection.Count; 
 
            _collection = new FrugalStructList<Transform>(count);
 
            for (int i = 0; i < count; i++)
            {
                Transform newValue = (Transform) sourceTransformCollection._collection[i].GetAsFrozen();
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue); 
                _collection.Add(newValue);
                OnInsert(newValue); 
            } 

        } 
        /// <summary>
        /// Implementation of Freezable.GetCurrentValueAsFrozenCore()
        /// </summary>
        protected /*override*/ void GetCurrentValueAsFrozenCore(Freezable source) 
        {
            TransformCollection sourceTransformCollection = (TransformCollection) source; 
 
            super.GetCurrentValueAsFrozenCore(source);
 
            int count = sourceTransformCollection._collection.Count;

            _collection = new FrugalStructList<Transform>(count);
 
            for (int i = 0; i < count; i++)
            { 
                Transform newValue = (Transform) sourceTransformCollection._collection[i].GetCurrentValueAsFrozen(); 
                OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                _collection.Add(newValue); 
                OnInsert(newValue);
            }

        } 
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.FreezeCore">Freezable.FreezeCore</see>. 
        /// </summary> 
        protected /*override*/ boolean FreezeCore(boolean isChecking)
        { 
            boolean canFreeze = super.FreezeCore(isChecking);

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

//         #endregion Internal Methods
 
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


 

        /*internal*/ public FrugalStructList<Transform> _collection; 
        /*internal*/ public uint _version = 0; 

 
//        #endregion Internal Fields

//        #region Enumerator
        /// <summary> 
        /// Enumerates the items in a TransformCollection
        /// </summary> 
        public class Enumerator implements IEnumerator, IEnumerator<Transform> 
        {
//            #region Constructor 

            /*internal*/ public Enumerator(TransformCollection list)
            {
                Debug.Assert(list != null, "list may not be null."); 

                _list = list; 
                _version = list._version; 
                _index = -1;
                _current = default(Transform); 
            }

//            #endregion
 
//            #region Methods
 
            void /*IDisposable.*/Dispose() 
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
 
            public Object /*IEnumerator.*/Current
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
            public Transform Current
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
            private Transform _current; 
            private TransformCollection _list;
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
        public TransformCollection() 
        { 
            _collection = new FrugalStructList<Transform>();
        } 

        /// <summary>
        /// Initializes a new instance that is empty and has the specified initial capacity.
        /// </summary> 
        /// <param name="capacity"> int - The number of elements that the new list is initially capable of storing. </param>
        public TransformCollection(int capacity) 
        { 
            _collection = new FrugalStructList<Transform>(capacity);
        } 

        /// <summary>
        /// Creates a TransformCollection with all of the same elements as collection
        /// </summary> 
        public TransformCollection(IEnumerable<Transform> collection)
        { 
            // The WritePreamble and WritePostscript aren't technically necessary 
            // in the constructor as of 1/20/05 but they are put here in case
            // their behavior changes at a later date 

            WritePreamble();

            if (collection != null) 
            {
                boolean needsItemValidation = true; 
                ICollection<Transform> icollectionOfT = collection as ICollection<Transform>; 

                if (icollectionOfT != null) 
                {
                    _collection = new FrugalStructList<Transform>(icollectionOfT);
                }
                else 
                {
                    ICollection icollection = collection as ICollection; 
 
                    if (icollection != null) // an IC but not and IC<T>
                    { 
                        _collection = new FrugalStructList<Transform>(icollection);
                    }
                    else // not a IC or IC<T> so fall back to the slower Add
                    { 
                        _collection = new FrugalStructList<Transform>();
 
                        for/*each*/ (Transform item : collection) 
                        {
                            if (item == null) 
                            {
                                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                            }
                            Transform newValue = item; 
                            OnFreezablePropertyChanged(/* oldValue = */ null, newValue);
                            _collection.Add(newValue); 
                            OnInsert(newValue); 
                        }
 
                        needsItemValidation = false;
                    }
                }
 
                if (needsItemValidation)
                { 
                    for/*each*/ (Transform item : collection) 
                    {
                        if (item == null) 
                        {
                            throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull));
                        }
                        OnFreezablePropertyChanged(/* oldValue = */ null, item); 
                        OnInsert(item);
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