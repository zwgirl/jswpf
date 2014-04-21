package org.summer.view.widget;
public class IntegerCollection : IList {
            private ListBox owner;
            private int[] innerArray;
            private int count=0;
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.IntegerCollection"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public IntegerCollection(ListBox owner) {
                this.owner = owner;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.Count"]/*">
            /// <devdoc>
            ///    <para>Number of current selected items.</para>
            /// </devdoc>
            [Browsable(false)]
            public int Count {
                get {
                    return count;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.ICollection.SyncRoot"]/*">
            /// <internalonly>
            object ICollection.SyncRoot {
                get {
                    return this;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.ICollection.IsSynchronized"]/*">
            /// <internalonly>
            bool ICollection.IsSynchronized {
                get {
                    return true;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.IsFixedSize"]/*">
            /// <internalonly>
            bool IList.IsFixedSize {
                get {
                    return false;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.IsReadOnly"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            bool IList.IsReadOnly {
                get {
                    return false;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.Contains"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public bool Contains(int item) {
                return IndexOf(item) != -1;
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.Contains"]/*">
            /// <internalonly>
            bool IList.Contains(object item) {
                if (item is Int32) {
                    return Contains((int)item);
                }
                else {
                    return false;
                }
            }
  
            public void Clear()
            {
                count = 0;
                innerArray = null;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.IndexOf"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public int IndexOf(int item) {
                int index = -1;
 
                if (innerArray != null) {
                    index = Array.IndexOf(innerArray, item);
  
                    // We initialize innerArray with more elements than needed in the method EnsureSpace,
                    // and we don't actually remove element from innerArray in the method RemoveAt,
                    // so there maybe some elements which are not actually in innerArray will be found
                    // and we need to filter them out
                    if (index >= count) {
                        index = -1;
                    }
                }
  
                return index;
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.IndexOf"]/*">
            /// <internalonly>
            int IList.IndexOf(object item) {
                if (item is Int32) {
                    return IndexOf((int)item);
                }
                else {
                    return -1;
                }
            }
  
 
            /// <devdoc>
            ///     Add a unique integer to the collection in sorted order.
            ///     A SystemException occurs if there is insufficient space available to
            ///     store the new item.
            /// </devdoc>
            private int AddInternal(int item) {
 
                EnsureSpace(1);
 
                int index = IndexOf(item);
                if (index == -1) {
                    innerArray[count++] = item;
                    Array.Sort(innerArray,0,count);
                    index = IndexOf(item);
                }
               return index;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.Add"]/*">
            /// <devdoc>
            ///     Adds a unique integer to the collection in sorted order.
            ///     A SystemException occurs if there is insufficient space available to
            ///     store the new item.
            /// </devdoc>
            public int Add(int item) {
                int index = AddInternal(item);
                owner.UpdateCustomTabOffsets();
 
                return index;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.Add"]/*">
            /// <internalonly>
            [SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
            [
                SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters") // "item" is the name of the param passed in.
                                                                                                            // So we don't have to localize it.
            ]
            int IList.Add(object item) {
                if (!(item is int)) {
                    throw new ArgumentException("item");
                }
                return Add((int)item);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.AddRange2"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void AddRange(int[] items) {
                AddRangeInternal((ICollection)items);
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.AddRange1"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void AddRange(IntegerCollection value) {
                AddRangeInternal((ICollection)value);
            }
 
            /// <devdoc>
            ///     Add range that bypasses the data source check.
            /// </devdoc>
            [SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
            [
                SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters") // "item" is the name of the param passed in.
                                                                                                            // So we don't have to localize it.
            ]
            private void AddRangeInternal(ICollection items) {
                if (items == null) {
                    throw new ArgumentNullException("items");
                }
                owner.BeginUpdate();
                try
                {
                    EnsureSpace(items.Count);
                    foreach(object item in items) {
                        if (!(item is int)) {
                            throw new ArgumentException("item");
                        }
                        else {
                            AddInternal((int)item);
                        }
                    }
                    owner.UpdateCustomTabOffsets();
                }
                finally
                {
                    owner.EndUpdate();
                }
            }
  
 
            /// <devdoc>
            ///     Ensures that our internal array has space for
            ///     the requested # of elements.
            /// </devdoc>
            private void EnsureSpace(int elements) {
                if (innerArray == null) {
                    innerArray = new int[Math.Max(elements, 4)];
                }
                else if (count + elements >= innerArray.Length) {
                    int newLength = Math.Max(innerArray.Length * 2, innerArray.Length + elements);
                    int[] newEntries = new int[newLength];
                    innerArray.CopyTo(newEntries, 0);
                    innerArray = newEntries;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.Clear"]/*">
            /// <internalonly>
            void IList.Clear() {
                Clear();
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.Insert"]/*">
            /// <internalonly>
            void IList.Insert(int index, object value) {
                throw new NotSupportedException(SR.GetString(SR.ListBoxCantInsertIntoIntegerCollection));
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.Remove"]/*">
            /// <internalonly>
            [SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
            [
                SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters") // "value" is the name of the param passed in.
                                                                                                            // So we don't have to localize it.
            ]
            void IList.Remove(object value) {
                if (!(value is int)) {
                    throw new ArgumentException("value");
                }
                Remove((int)value);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.RemoveAt"]/*">
            /// <internalonly>
            void IList.RemoveAt(int index) {
                RemoveAt(index);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.Remove1"]/*">
            /// <devdoc>
            ///     Removes the given item from the array.  If
            ///     the item is not in the array, this does nothing.
            /// </devdoc>
            public void Remove(int item) {
  
                int index = IndexOf(item);
 
                if (index != -1) {
                    RemoveAt(index);
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.RemoveAt1"]/*">
            /// <devdoc>
            ///     Removes the item at the given index.
            /// </devdoc>
            public void RemoveAt(int index) {
                if (index < 0 || index >= count) {
                    throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                }
  
                count--;
                for (int i = index; i < count; i++) {
                    innerArray[i] = innerArray[i+1];
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.this"]/*">
            /// <devdoc>
            ///     Retrieves the specified selected item.
            /// </devdoc>
            [
                SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters") // "index" is the name of the param passed in.
                                                                                                            // So we don't have to localize it.
            ]
            public int this[int index] {
                get {
                    return innerArray[index];
                }
                [
                    SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")     // This exception already shipped.
                                                                                                            // We can't change its text.
                ]
                set {
 
                    if (index < 0 || index >= count) {
                        throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                    }
                    innerArray[index] = (int)value;
                    owner.UpdateCustomTabOffsets();
  
 
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="IntegerCollection.IList.this"]/*">
            /// <internalonly>
            [SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
            object IList.this[int index] {
                get {
                    return this[index];
                }
                [
                    SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters"),    // "value" is the name of the param.
                                                                                                                    // So we don't have to localize it.
                    SuppressMessage("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")             // This exception already shipped.
                                                                                                                    // We can't change its text.
                ]
                set {
                    if (!(value is int)) {
                        throw new ArgumentException("value");
                    }
                    else {
                        this[index] = (int)value;
                    }
 
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.CopyTo"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void CopyTo(Array destination, int index) {
                int cnt = Count;
                for (int i = 0; i < cnt; i++) {
                    destination.SetValue(this[i], i + index);
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection.GetEnumerator"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            IEnumerator IEnumerable.GetEnumerator() {
                return new CustomTabOffsetsEnumerator(this);
            }
  
            /// <devdoc>
            ///     EntryEnumerator is an enumerator that will enumerate over
            ///     a given state mask.
            /// </devdoc>
            private class CustomTabOffsetsEnumerator : IEnumerator {
                private IntegerCollection items;
                private int current;
 
                /// <devdoc>
                ///     Creates a new enumerator that will enumerate over the given state.
                /// </devdoc>
                public CustomTabOffsetsEnumerator(IntegerCollection items) {
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
 
        //*****************************************************************************************
 
        // SelectedIndices
        /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.SelectedIndexCollection"]/*">
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        