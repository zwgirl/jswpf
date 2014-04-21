package org.summer.view.widget.model;

import org.summer.view.widget.INotifyCollectionChanged;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.collection.Collection;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
   /// <summary> 
    /// Implementation of a dynamic data collection of SortDescriptions.
    /// </summary> 
    public class SortDescriptionCollection extends Collection<SortDescription> implements INotifyCollectionChanged
    {
        //-----------------------------------------------------
        // 
        //  Public Events
        // 
        //----------------------------------------------------- 

//        #region Public Events 

        /// <summary>
        /// Occurs when the collection changes, either by adding or removing an item.
        /// </summary> 
        /// <remarks>
        /// see <seealso cref="INotifyCollectionChanged"/> 
        /// </remarks> 
        /*event*/ NotifyCollectionChangedEventHandler INotifyCollectionChanged.CollectionChanged
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
        protected /*event*/ NotifyCollectionChangedEventHandler CollectionChanged;
 
//        #endregion Public Events 

 
        //------------------------------------------------------
        //
        //  Protected Methods
        // 
        //-----------------------------------------------------
 
//        #region Protected Methods 

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners
        /// </summary>
        protected /*override*/ void ClearItems() 
        {
            super.ClearItems(); 
            OnCollectionChanged(NotifyCollectionChangedAction.Reset); 
        }
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
        protected /*override*/ void RemoveItem(int index)
        { 
            SortDescription removedItem = this[index]; 
            super.RemoveItem(index);
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, index); 
        }

        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is added to list; 
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
        protected /*override*/ void InsertItem(int index, SortDescription item) 
        {
            item.Seal(); 
            super.InsertItem(index, item);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index);
        }
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is set in the list; 
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
        protected /*override*/ void SetItem(int index, SortDescription item) 
        {
            item.Seal();
            SortDescription originalItem = this[index];
            super.SetItem(index, item); 
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, originalItem, index);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index); 
        } 

        /// <summary> 
        /// raise CollectionChanged event to any listeners
        /// </summary>
        private void OnCollectionChanged(NotifyCollectionChangedAction action, Object item, int index)
        { 
            if (CollectionChanged != null)
            { 
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action, item, index)); 
            }
        } 
        // raise CollectionChanged event to any listeners
        void OnCollectionChanged(NotifyCollectionChangedAction action)
        {
            if (CollectionChanged != null) 
            {
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action)); 
            } 
        }
//        #endregion Protected Methods 


        /// <summary>
        /// Immutable, read-only SortDescriptionCollection 
        /// </summary>
        class EmptySortDescriptionCollection extends SortDescriptionCollection implements IList 
        { 
            //------------------------------------------------------
            // 
            //  Protected Methods
            //
            //------------------------------------------------------
 
//            #region Protected Methods
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when the list is being cleared;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected /*override*/ void ClearItems()
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is removed from list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected /*override*/ void RemoveItem(int index)
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is added to list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected /*override*/ void InsertItem(int index, SortDescription item)
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is set in list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected /*override*/ void SetItem(int index, SortDescription item)
            {
                throw new NotSupportedException(); 
            }
 
//            #endregion Protected Methods 

//            #region IList Implementations 

            // explicit implementation to /*override*/ the IsReadOnly and IsFixedSize properties

            public boolean /*IList.*/IsFixedSize 
            {
                  get { return true; } 
            } 

            public boolean /*IList.*/IsReadOnly 
            {
                  get { return true; }
            }
//            #endregion IList Implementations 

        } 
 
        /// <summary>
        /// returns an empty and non-modifiable SortDescriptionCollection 
        /// </summary>
        public static final SortDescriptionCollection Empty = new EmptySortDescriptionCollection();

    } 