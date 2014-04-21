package org.summer.view.widget.data;

import java.lang.reflect.Array;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.CollectionChangedEventManager;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.INotifyCollectionChanged;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.ICollectionViewFactory;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;
/// <summary>
    /// CompositeCollection will contain items shaped as strings, objects, xml nodes, 
    /// elements as well as other collections. 
    /// A <seealso cref="System.Windows.Controls.ItemsControl"/> uses the data
    /// in the CompositeCollection to generate its content according to its ItemTemplate. 
    /// </summary>

//    [Localizability(LocalizationCategory.Ignore)]
    public class CompositeCollection implements IList, INotifyCollectionChanged, ICollectionViewFactory, IWeakEventListener 
    {
        //----------------------------------------------------- 
        // 
        //  Constructors
        // 
        //-----------------------------------------------------

//        #region Constructors
 
        /// <summary>
        /// Initializes a new instance of CompositeCollection that is empty and has default initial capacity. 
        /// </summary> 
        public CompositeCollection()
        { 
            Initialize(new ArrayList());
        }

        /// <summary> 
        /// Initializes a new instance of CompositeCollection that is empty and has specified initial capacity.
        /// </summary> 
        /// <param name="capacity">The number of items that the new list is initially capable of storing</param> 
        /// <remarks>
        /// Some ItemsControl implementations have better idea how many items to anticipate, 
        /// capacity parameter lets them tailor the initial size.
        /// </remarks>
        public CompositeCollection(int capacity)
        { 
            Initialize(new ArrayList(capacity));
        } 
 
//        #endregion Constructors
 

        //------------------------------------------------------
        //
        //  Public Methods 
        //
        //----------------------------------------------------- 
 
//        #region Public Methods
        /// <summary> 
        ///     Returns an enumerator Object for this CompositeCollection
        /// </summary>
        /// <returns>
        ///     Enumerator Object for this CompositeCollection 
        /// </returns>
        IEnumerator IEnumerable.GetEnumerator() 
        { 
            // Enumerator from the underlying ArrayList
            return InternalList.GetEnumerator(); 
        }

        /// <summary>
        ///     Makes a shallow copy of Object references from this 
        ///     CompositeCollection to the given target array
        /// </summary> 
        /// <param name="array"> 
        ///     Target of the copy operation
        /// </param> 
        /// <param name="index">
        ///     Zero-based index at which the copy begins
        /// </param>
        public void CopyTo(Array array, int index) 
        {
            // Forward call to /*internal*/ public list. 
            InternalList.CopyTo(array, index); 
        }
 
        /// <summary>
        ///     Add an item to this collection.
        /// </summary>
        /// <param name="newItem"> 
        ///     New item to be added to collection
        /// </param> 
        /// <returns> 
        ///     Zero-based index where the new item is added.
        /// </returns> 
        /// <exception cref="ArgumentException">
        ///     CompositeCollection can only accept CollectionContainers it doesn't already have.
        /// </exception>
        public int Add(Object newItem) 
        {
            CollectionContainer cc = newItem as CollectionContainer; 
            if (cc != null) 
            {
                AddCollectionContainer(cc); 
            }

            int addedIndex = InternalList.Add(newItem);
 
            OnCollectionChanged(NotifyCollectionChangedAction.Add, newItem, addedIndex);
            return addedIndex; 
        } 

        /// <summary> 
        ///     Clears the collection.  Releases the references on all items
        /// currently in the collection.
        /// </summary>
        public void Clear() 
        {
            // unhook contained collections 
            for (int k=0, n=InternalList.Count;  k < n;  ++k) 
            {
                CollectionContainer cc = this[k] as CollectionContainer; 
                if (cc != null)
                {
                    RemoveCollectionContainer(cc);
                } 
            }
 
            InternalList.Clear(); 
            OnCollectionChanged(NotifyCollectionChangedAction.Reset);
        } 

        /// <summary>
        ///     Checks to see if a given item is in this collection
        /// </summary> 
        /// <param name="containItem">
        ///     The item whose membership in this collection is to be checked. 
        /// </param> 
        /// <returns>
        ///     True if the collection contains the given item 
        /// </returns>
        public boolean Contains(Object containItem)
        {
            return InternalList.Contains(containItem); 
        }
 
        /// <summary> 
        ///     Finds the index in this collection where the given item is found.
        /// </summary> 
        /// <param name="indexItem">
        ///     The item whose index in this collection is to be retrieved.
        /// </param>
        /// <returns> 
        ///     Zero-based index into the collection where the given item can be
        /// found.  Otherwise, -1 
        /// </returns> 
        public int IndexOf(Object indexItem)
        { 
            return InternalList.IndexOf(indexItem);
        }

        /// <summary> 
        ///     Insert an item in the collection at a given index.  All items
        /// after the given position are moved down by one. 
        /// </summary> 
        /// <param name="insertIndex">
        ///     The index at which to inser the item 
        /// </param>
        /// <param name="insertItem">
        ///     The item reference to be added to the collection
        /// </param> 
        /// <exception cref="ArgumentOutOfRangeException">
        /// Thrown if index is out of range 
        /// </exception> 
        public void Insert(int insertIndex, Object insertItem)
        { 
            CollectionContainer cc = insertItem as CollectionContainer;
            if (cc != null)
            {
                AddCollectionContainer(cc); 
            }
 
            // ArrayList implementation checks index and will throw out of range exception 
            InternalList.Insert(insertIndex, insertItem);
 
            OnCollectionChanged(NotifyCollectionChangedAction.Add, insertItem, insertIndex);
        }

        /// <summary> 
        ///     Removes the given item reference from the collection.  All
        /// remaining items move up by one. 
        /// </summary> 
        /// <param name="removeItem">
        ///     The item to be removed. 
        /// </param>
        public void Remove(Object removeItem)
        {
            int index = InternalList.IndexOf(removeItem); 
            if (index >= 0)
            { 
                // to ensure model parent is cleared and the CollectionChange notification is raised, 
                // call this.RemoveAt, not the aggregated ArrayList
                this.RemoveAt(index); 
            }
        }

        /// <summary> 
        ///     Removes an item from the collection at the given index.  All
        /// remaining items move up by one. 
        /// </summary> 
        /// <param name="removeIndex">
        ///     The index at which to remove an item. 
        /// </param>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Thrown if index is out of range
        /// </exception> 
        public void RemoveAt(int removeIndex)
        { 
            if ((0 <= removeIndex) && (removeIndex < Count)) 
            {
                Object removedItem = this[removeIndex]; 

                CollectionContainer cc = removedItem as CollectionContainer;
                if (cc != null)
                { 
                    RemoveCollectionContainer(cc);
                } 
 
                InternalList.RemoveAt(removeIndex);
 
                OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, removeIndex);
            }
            else
            { 
                throw new ArgumentOutOfRangeException("removeIndex",
                            SR.Get(SRID.ItemCollectionRemoveArgumentOutOfRange)); 
            } 
        }
 

        /// <summary>
        /// Create a new view on this collection [Do not call directly].
        /// </summary> 
        /// <remarks>
        /// Normally this method is only called by the platform's view manager, 
        /// not by user code. 
        /// </remarks>
        ICollectionView ICollectionViewFactory.CreateView() 
        {
            return new CompositeCollectionView(this);
        }
 
//        #endregion Public Methods
 
 
        //------------------------------------------------------
        // 
        //  Public Properties
        //
        //------------------------------------------------------
 
//        #region Public Properties
 
        /// <summary> 
        ///     Read-only property for the number of items stored in this collection of objects
        /// </summary> 
        /// <remarks>
        ///     CollectionContainers each count as 1 item.
        ///     When in ItemsSource mode, Count always equals 1.
        /// </remarks> 
        public int Count
        { 
            get 
            {
                // Return value from the underlying ArrayList. 
                return InternalList.Count;
            }
        }
 
        /// <summary>
        ///     Indexer property to retrieve or replace the item at the given 
        /// zero-based offset into the collection. 
        /// </summary>
        /// <exception cref="ArgumentOutOfRangeException"> 
        /// Thrown if index is out of range
        /// </exception>
        public Object this[int itemIndex]
        { 
            get
            { 
                // ArrayList implementation checks index and will throw out of range exception 
                return InternalList[itemIndex];
            } 
            set
            {
                // ArrayList implementation checks index and will throw out of range exception
                Object originalItem = InternalList[itemIndex]; 

                // unhook the old, hook the new 
                CollectionContainer cc; 
                if ((cc = originalItem as CollectionContainer) != null)
                { 
                    RemoveCollectionContainer(cc);
                }
                if ((cc = value as CollectionContainer) != null)
                { 
                    AddCollectionContainer(cc);
                } 
 
                // make the change
                InternalList[itemIndex] = value; 

                OnCollectionChanged(NotifyCollectionChangedAction.Replace, originalItem, value, itemIndex);
            }
        } 

        /// <summary> 
        ///     Gets a value indicating whether access to the CompositeCollection is synchronized (thread-safe). 
        /// </summary>
        boolean ICollection.IsSynchronized 
        {
            get
            {
                // Return value from the underlying ArrayList. 
                return InternalList.IsSynchronized;
            } 
        } 

        /// <summary> 
        ///     Returns an Object to be used in thread synchronization.
        /// </summary>
        Object ICollection.SyncRoot
        { 
            get
            { 
                // Return the SyncRoot Object of the underlying ArrayList 
                return InternalList.SyncRoot;
            } 
        }

        /// <summary>
        ///     Gets a value indicating whether the IList has a fixed size. 
        ///     An CompositeCollection can usually grow dynamically,
        ///     this call will commonly return FixedSize = False. 
        ///     In ItemsSource mode, this call will return IsFixedSize = True. 
        /// </summary>
        boolean IList.IsFixedSize 
        {
            get
            {
                return InternalList.IsFixedSize; 
            }
        } 
 
        /// <summary>
        ///     Gets a value indicating whether the IList is read-only. 
        ///     An CompositeCollection is usually writable,
        ///     this call will commonly return IsReadOnly = False.
        ///     In ItemsSource mode, this call will return IsReadOnly = True.
        /// </summary> 
        boolean IList.IsReadOnly
        { 
            get 
            {
                return InternalList.IsReadOnly; 
            }
        }

//        #endregion Public Properties 

 
        //----------------------------------------------------- 
        //
        //  Public Events 
        //
        //------------------------------------------------------

//        #region Public Events 

        /// <summary> 
        /// Occurs when the collection changes, either by adding or removing an item 
        /// <see cref="INotifyCollectionChanged" />
        /// </summary> 
        event NotifyCollectionChangedEventHandler INotifyCollectionChanged.CollectionChanged
        {
            add
            { 
                CollectionChanged += value;
            } 
            remove 
            {
                CollectionChanged -= value; 
            }
        }

        /// <summary> 
        /// Occurs when the collection changes, either by adding or removing an item.
        /// </summary> 
        protected event NotifyCollectionChangedEventHandler CollectionChanged; 

//        #endregion Public Events 

//        #region IWeakEventListener

        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary> 
        boolean IWeakEventListener.ReceiveWeakEvent(Type managerType, Object sender, EventArgs e) 
        {
            return ReceiveWeakEvent(managerType, sender, e); 
        }

        /// <summary>
        /// Handle events from the centralized event table 
        /// </summary>
        protected virtual boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e) 
        { 
            if (managerType == typeof(CollectionChangedEventManager))
            { 
                // A CollectionContainer has raised a change event.  Forward
                // it to the CompositeCollectionView(s).
                OnContainedCollectionChanged(sender, (NotifyCollectionChangedEventArgs)e);
            } 
            else
            { 
                return false;       // unrecognized event 
            }
 
            return true;
        }

//        #endregion IWeakEventListener 

        //----------------------------------------------------- 
        // 
        //  Internal Events
        // 
        //-----------------------------------------------------

//        #region Internal Events
 
        /*internal*/ public event NotifyCollectionChangedEventHandler ContainedCollectionChanged;
 
        private void OnContainedCollectionChanged(Object sender, NotifyCollectionChangedEventArgs e) 
        {
            if (ContainedCollectionChanged != null) 
                ContainedCollectionChanged(sender, e);
        }

//        #endregion Internal Events 

        //----------------------------------------------------- 
        // 
        //  Private Methods
        // 
        //------------------------------------------------------

//        #region Private Methods
 
        // common ctor initialization
        private void Initialize(ArrayList internalList) 
        { 
            _internalList = internalList;
        } 

        // ArrayList that holds collection containers as well as single items
        private ArrayList InternalList
        { 
            get
            { 
                return _internalList; 
            }
        } 

        // Hook up to a newly-added CollectionContainer
        private void AddCollectionContainer(CollectionContainer cc)
        { 
            if (InternalList.Contains(cc))
                throw new ArgumentException(/*SR.Get(SRID.CollectionContainerMustBeUniqueForComposite), "cc"*/); 
 
            CollectionChangedEventManager.AddListener(cc, this);
 
//#if DEBUG
//            _hasRepeatedCollectionIsValid = false;
//#endif
        } 

        // Unhook a newly-deleted CollectionContainer 
        private void RemoveCollectionContainer(CollectionContainer cc) 
        {
            CollectionChangedEventManager.RemoveListener(cc, this); 

//#if DEBUG
//            _hasRepeatedCollectionIsValid = false;
//#endif 
        }
 
        // raise CollectionChanged event to any listeners 
        void OnCollectionChanged(NotifyCollectionChangedAction action)
        { 
//#if DEBUG
//            _hasRepeatedCollectionIsValid = false;
//#endif
 
            if (CollectionChanged != null)
            { 
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action)); 
            }
        } 

        // raise CollectionChanged event to any listeners
        void OnCollectionChanged(NotifyCollectionChangedAction action, Object item, int index)
        { 
            if (CollectionChanged != null)
            { 
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action, item, index)); 
            }
        } 

        /// raise CollectionChanged event to any listeners
        void OnCollectionChanged(NotifyCollectionChangedAction action, Object oldItem, Object newItem, int index)
        { 
            if (CollectionChanged != null)
            { 
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action, newItem, oldItem, index)); 
            }
        } 

//        #endregion Private Methods

 
        //-----------------------------------------------------
        // 
        //  Private Fields 
        //
        //------------------------------------------------------ 

//        #region Private Fields

        private ArrayList               _internalList; 

//        #endregion Private Fields 
 

        //------------------------------------------------------ 
        //
        //  Debugging Aids
        //
        //----------------------------------------------------- 

//        #region Debugging Aids 
 
//#if DEBUG
        /*internal*/ public boolean HasRepeatedCollection() 
        {
            if (!_hasRepeatedCollectionIsValid)
            {
                _hasRepeatedCollection = FindRepeatedCollection(new ArrayList()); 
                _hasRepeatedCollectionIsValid = true;
            } 
            return _hasRepeatedCollection; 
        }
 
        // recursive depth-first search for repeated collection
        private boolean FindRepeatedCollection(ArrayList collections)
        {
            for (int i = 0; i < Count; ++i) 
            {
                CollectionContainer cc = this[i] as CollectionContainer; 
                if (cc != null && cc.Collection != null) 
                {
                    CompositeCollection composite = cc.Collection as CompositeCollection; 
                    if (composite != null)
                    {
                        if (composite.FindRepeatedCollection(collections))
                            return true; 
                    }
                    else if (collections.IndexOf(cc.Collection) > -1) 
                        return true; 
                    else
                        collections.Add(cc.Collection); 
                }
            }
            return false;
        } 

        private boolean _hasRepeatedCollection = false; 
        private boolean _hasRepeatedCollectionIsValid = false; 
//#endif
 
//        #endregion Debugging Aids

    }