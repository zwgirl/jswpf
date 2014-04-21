package org.summer.view.widget;
public class SelectedIndexCollection : IList {
            private ListBox owner;
  
            /* C#r: protected */
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.SelectedIndexCollection"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public SelectedIndexCollection(ListBox owner) {
                this.owner = owner;
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.Count"]/*">
            /// <devdoc>
            ///    <para>Number of current selected items.</para>
            /// </devdoc>
            [Browsable(false)]
            public int Count {
                get {
                    return owner.SelectedItems.Count;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.ICollection.SyncRoot"]/*">
            /// <internalonly>
            object ICollection.SyncRoot {
                get {
                    return this;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.ICollection.IsSynchronized"]/*">
            /// <internalonly>
            bool ICollection.IsSynchronized {
                get {
                    return true;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.IsFixedSize"]/*">
            /// <internalonly>
            bool IList.IsFixedSize {
                get {
                    return true;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.IsReadOnly"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public bool IsReadOnly {
                get {
                    return true;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.Contains"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public bool Contains(int selectedIndex) {
                return IndexOf(selectedIndex) != -1;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.Contains"]/*">
            /// <internalonly>
            bool IList.Contains(object selectedIndex) {
                if (selectedIndex is Int32) {
                    return Contains((int)selectedIndex);
                }
                else {
                    return false;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.IndexOf"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public int IndexOf(int selectedIndex) {
  
                // Just what does this do?  The selectedIndex parameter above is the index into the
                // main object collection.  We look at the state of that item, and if the state indicates
                // that it is selected, we get back the virtualized index into this collection.  Indexes on
                // this collection match those on the SelectedObjectCollection.
                if (selectedIndex >= 0 &&
                    selectedIndex < InnerArray.GetCount(0) &&
                    InnerArray.GetState(selectedIndex, SelectedObjectCollection.SelectedObjectMask)) {
  
                    return InnerArray.IndexOf(InnerArray.GetItem(selectedIndex, 0), SelectedObjectCollection.SelectedObjectMask);
                }
  
                return -1;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.IndexOf"]/*">
            /// <internalonly>
            int IList.IndexOf(object selectedIndex) {
                if (selectedIndex is Int32) {
                    return IndexOf((int)selectedIndex);
                }
                else {
                    return -1;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.Add"]/*">
            /// <internalonly>
            int IList.Add(object value) {
                throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.Clear"]/*">
            /// <internalonly>
            void IList.Clear() {
                throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.Insert"]/*">
            /// <internalonly>
            void IList.Insert(int index, object value) {
                throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.Remove"]/*">
            /// <internalonly>
            void IList.Remove(object value) {
                throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.RemoveAt"]/*">
            /// <internalonly>
            void IList.RemoveAt(int index) {
                throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.this"]/*">
            /// <devdoc>
            ///     Retrieves the specified selected item.
            /// </devdoc>
            public int this[int index] {
                get {
                    object identifier = InnerArray.GetEntryObject(index, SelectedObjectCollection.SelectedObjectMask);
                    return InnerArray.IndexOfIdentifier(identifier, 0);
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="SelectedIndexCollection.IList.this"]/*">
            /// <internalonly>
            object IList.this[int index] {
                get {
                    return this[index];
                }
                set {
                    throw new NotSupportedException(SR.GetString(SR.ListBoxSelectedIndexCollectionIsReadOnly));
                }
            }
 
            /// <devdoc>
            ///     This is the item array that stores our data.  We share this backing store
            ///     with the main object collection.
            /// </devdoc>
            private ItemArray InnerArray {
                get {
                    owner.SelectedItems.EnsureUpToDate();
                    return ((ObjectCollection)owner.Items).InnerArray;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.CopyTo"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void CopyTo(Array destination, int index) {
                int cnt = Count;
                for (int i = 0; i < cnt; i++) {
                    destination.SetValue(this[i], i + index);
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.ClearSelected"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void Clear() {
                if (owner != null) {
                    owner.ClearSelected();
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.Add"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void Add(int index) {
                if (owner != null) {
                    ObjectCollection items = owner.Items;
                    if (items != null) {
                        if (index != -1 && !Contains(index)) {
                            owner.SetSelected(index, true);
                        }
                    }
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.Remove"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void Remove(int index) {
                if (owner != null) {
                    ObjectCollection items = owner.Items;
                    if (items != null) {
                        if (index != -1 && Contains(index)) {
                            owner.SetSelected(index, false);
                        }
                    }
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection.GetEnumerator"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public IEnumerator GetEnumerator() {
                return new SelectedIndexEnumerator(this);
            }
 
            /// <devdoc>
            ///     EntryEnumerator is an enumerator that will enumerate over
            ///     a given state mask.
            /// </devdoc>
            private class SelectedIndexEnumerator : IEnumerator {
                private SelectedIndexCollection items;
                private int current;
  
                /// <devdoc>
                ///     Creates a new enumerator that will enumerate over the given state.
                /// </devdoc>
                public SelectedIndexEnumerator(SelectedIndexCollection items) {
                    this.items = items;
                    this.current = -1;
                }
 
                /// <devdoc>
                ///     Moves to the next element, or returns false if at the end.
                /// </devdoc>
                bool IEnumerator.MoveNext() {
  
                    if (current < items.Count - 1) {
                        current++;
                        return true;
                    }
                    else {
                        current = items.Count;
                        return false;
                    }
                }
 
                /// <devdoc>
                ///     Resets the enumeration back to the beginning.
                /// </devdoc>
                void IEnumerator.Reset() {
                    current = -1;
                }
 
                /// <devdoc>
                ///     Retrieves the current value in the enumerator.
                /// </devdoc>
                object IEnumerator.Current {
                    get {
                        if (current == -1 || current == items.Count) {
                            throw new InvalidOperationException(SR.GetString(SR.ListEnumCurrentOutOfRange));
                        }
 
                        return items[current];
                    }
                }
            }
        }
  
        // Should be "ObjectCollection", except we already have one of those.
        /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedObjectCollection"]/*">
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        