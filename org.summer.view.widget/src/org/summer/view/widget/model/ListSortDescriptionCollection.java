package org.summer.view.widget.model;

import java.lang.reflect.Array;

import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;

/// <devdoc> 
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
//    [HostProtection(SharedState = true)]
    public class ListSortDescriptionCollection implements IList { 
        ArrayList sorts = new ArrayList();
 
        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public ListSortDescriptionCollection() {
        }

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public ListSortDescriptionCollection(ListSortDescription[] sorts) { 
            if (sorts != null) {
                for (int i = 0; i < sorts.length; i ++) { 
                    this.sorts.Add(sorts[i]);
                }
            }
        } 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
        public ListSortDescription this[int index] { 
            get {
                return (ListSortDescription) sorts[index];
            }
            set { 
                throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/);
            } 
        } 

        // IList implementation 
        //

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
       public boolean /*IList.*/IsFixedSize { 
            get { 
                return true;
            } 
        }

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
       public boolean /*IList.*/IsReadOnly { 
            get { 
                return true;
            } 
        }

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
        public Object /*IList.*/this[int index] { 
            get { 
                return this[index];
            } 
            set {
                throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/);
            }
        } 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
        public int /*IList.*/Add(Object value) { 
            throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/);
        }

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public void /*IList.*/Clear() { 
            throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/);
        } 

        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public boolean Contains(Object value) {
            return ((IList)this.sorts).Contains(value); 
        } 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        public int IndexOf(Object value) {
            return ((IList)this.sorts).IndexOf(value); 
        }
 
        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public void /*IList.*/Insert(int index, Object value) {
            throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/);
        }
 
        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
        public void /*IList.*/Remove(Object value) {
            throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/); 
        }

        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
        public  void /*IList.*/RemoveAt(int index) { 
            throw new InvalidOperationException(/*SR.GetString(SR.CantModifyListSortDescriptionCollection)*/); 
        }
 
        // ICollection
        //

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public int Count { 
            get {
                return this.sorts.Count; 
            }
        }

        /// <devdoc> 
        ///    <para>[To be supplied.]</para>
        /// </devdoc> 
        public boolean /*ICollection.*/IsSynchronized { 
            get {
                // true because after the constructor finished running the ListSortDescriptionCollection is Read Only 
                return true;
            }
        }
 
        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
        public Object /*ICollection.*/SyncRoot {
            get { 
                return this;
            }
        }
 
        /// <devdoc>
        ///    <para>[To be supplied.]</para> 
        /// </devdoc> 
        public void CopyTo(Array array, int index) {
            this.sorts.CopyTo(array, index); 
        }

        // IEnumerable
        // 

        /// <devdoc> 
        ///    <para>[To be supplied.]</para> 
        /// </devdoc>
        public  IEnumerator /*IEnumerable.*/GetEnumerator() { 
            return this.sorts.GetEnumerator();
        }
    }