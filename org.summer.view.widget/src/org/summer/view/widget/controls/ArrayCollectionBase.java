package org.summer.view.widget.controls;

import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
  /// <summary>
    /// Abstract base class for array based collections and simply provides
    /// the default implementation for ICollection, and IEnumerable
    /// </summary>
    public abstract class ArrayCollectionBase implements ICollection, IEnumerable
    {
        protected ArrayList collection;
        /// <summary>
        /// Creates a new base collection.
        /// </summary>
        protected ArrayCollectionBase()
        {
            this.collection = new ArrayList();
        }
        /// <summary>
        /// Gets the number of items in the collection.
        /// </summary>
        /// <value>Number of items in collection.</value>
        public int Count
        {
            get { return this.collection.Count; }
        }
        /// <summary>
        /// Gets if the collection has been synchronized.
        /// </summary>
        /// <value>True if the collection has been synchronized.</value>
        public boolean IsSynchronized
        {
            get { return this.collection.IsSynchronized; }
        }
        /// <summary>
        /// Gets the Object used to synchronize the collection.
        /// </summary>
        /// <value>Oject used the synchronize the collection.</value>
        public Object SyncRoot
        {
            get { return this; }
        }
        /// <summary>
        /// Copies the collection into an array.
        /// </summary>
        /// <param name="array">Array to copy the collection into.</param>
        /// <param name="index">Index to start copying from.</param>
        public void CopyTo(System.Array array, int index)
        {
            this.collection.CopyTo(array, index);
        }
        /// <summary>
        /// Checks if the collection contains item.
        /// </summary>
        /// <param name="item">Item to check in collection.</param>
        /// <returns>True if collection contains item.</returns>
        public boolean Contains(Object item)
        {
            return this.collection.Contains(item);
        }
        /// <summary>
        /// Gets enumerator for the collection.
        /// </summary>
        /// <returns>Enumerator for the collection.</returns>
        public /*virtual*/ IEnumerator GetEnumerator()
        {
            return this.collection.GetEnumerator();
        }
    }