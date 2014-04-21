package org.summer.view.widget;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;

public class ObjectCollection implements IList {
  
            private ListBox owner;
            private ItemArray items;
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.ObjectCollection"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public ObjectCollection(ListBox owner) {
                this.owner = owner;
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.ObjectCollection1"]/*">
            /// <devdoc>
            ///     <para>
            ///       Initializes a new instance of ListBox.ObjectCollection based on another ListBox.ObjectCollection.
            ///    </para>
            /// </devdoc>
            public ObjectCollection(ListBox owner, ObjectCollection value) {
                this.owner = owner;
                this.AddRange(value);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.ObjectCollection2"]/*">
            /// <devdoc>
            ///     <para>
            ///       Initializes a new instance of ListBox.ObjectCollection containing any array of Objects.
            ///    </para>
            /// </devdoc>
            public ObjectCollection(ListBox owner, Object[] value) {
                this.owner = owner;
                this.AddRange(value);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Count"]/*">
            /// <devdoc>
            ///     Retrieves the number of items.
            /// </devdoc>
            public int Count {
                get {
                    return InnerArray.GetCount(0);
                }
            }
 
            /// <devdoc>
            ///     /*internal*/ public access to the actual data store.
            /// </devdoc>
            /*internal*/ public ItemArray InnerArray {
                get {
                    if (items == null) {
                        items = new ItemArray(owner);
                    }
                    return items;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ObjectCollection.ICollection.SyncRoot"]/*">
            /// </*internal*/ publiconly>
            Object ICollection.SyncRoot {
                get {
                    return this;
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ObjectCollection.ICollection.IsSynchronized"]/*">
            /// </*internal*/ publiconly>
            boolean ICollection.IsSynchronized {
                get {
                    return false;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ObjectCollection.IList.IsFixedSize"]/*">
            /// </*internal*/ publiconly>
            boolean IList.IsFixedSize {
                get {
                    return false;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.IsReadOnly"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public boolean IsReadOnly {
                get {
                    return false;
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Add"]/*">
            /// <devdoc>
            ///     Adds an item to the List box. For an unsorted List box, the item is
            ///     added to the end of the existing list of items. For a sorted List box,
            ///     the item is inserted into the list according to its sorted position.
            ///     The item's toString() method is called to obtain the string that is
            ///     displayed in the combo box.
            ///     A SystemException occurs if there is insufficient space available to
            ///     store the new item.
            /// </devdoc>
 
            public int Add(Object item)
            {
                owner.CheckNoDataSource();
                int index = Add/*internal*/ public(item);
                owner.UpdateHorizontalExtent();
                return index;
            }
  
 
            private int Add/*internal*/ public(Object item)
            {
                if (item == null)
                {
                    throw new ArgumentNullException("item");
                }
                int index = -1;
                if (!owner.sorted)
                {
                    InnerArray.Add(item);
                }
                else
                {
                    if (Count > 0)
                    {
                        index = InnerArray.BinarySearch(item);
                        if (index < 0)
                        {
                            index = ~index; // getting the index of the first element that is larger than the search value
                                            //this index will be used for insert
                        }
                    }
                    else
                        index = 0;
 
                    Debug.Assert(index >= 0 && index <= Count, "Wrong index for insert");
                    InnerArray.Insert(index, item);
                }
                boolean successful = false;
 
                try
                {
                    if (owner.sorted)
                    {
                        if (owner.IsHandleCreated)
                        {
                            owner.NativeInsert(index, item);
                            owner.UpdateMaxItemWidth(item, false);
                            if (owner.selectedItems != null)
                            {
                                // VSWhidbey 95187: sorting may throw the LB contents and the selectedItem array out of synch.
                                owner.selectedItems.Dirty();
                            }
                        }
                    }
                    else
                    {
                        index = Count - 1;
                        if (owner.IsHandleCreated)
                        {
                            owner.NativeAdd(item);
                            owner.UpdateMaxItemWidth(item, false);
                        }
                    }
                    successful = true;
                }
                finally
                {
                    if (!successful)
                    {
                        InnerArray.Remove(item);
                    }
                }
  
                return index;
            }
  
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ObjectCollection.IList.Add"]/*">
            /// </*internal*/ publiconly>
            int IList.Add(Object item) {
                return Add(item);
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.AddRange1"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void AddRange(ObjectCollection value) {
                owner.CheckNoDataSource();
                AddRange/*internal*/ public((ICollection)value);
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.AddRange"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public void AddRange(Object[] items) {
                owner.CheckNoDataSource();
                AddRange/*internal*/ public((ICollection)items);
            }
  
            /*internal*/ public void AddRange/*internal*/ public(ICollection items) {
  
                if (items == null)
                {
                    throw new ArgumentNullException("items");
                }
                owner.BeginUpdate();
                try
                {
                    foreach (Object item in items)
                    {
                        // adding items one-by-one for performance
                        // not using sort because after the array is sorted index of each newly added item will need to be found
                        // Add/*internal*/ public is based on BinarySearch and finds index without any additional cost
                        Add/*internal*/ public(item);
                    }
                }
                finally
                {
                    owner.UpdateHorizontalExtent();
                    owner.EndUpdate();
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.this"]/*">
            /// <devdoc>
            ///     Retrieves the item with the specified index.
            /// </devdoc>
            [Browsable(false), DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
            public virtual Object this[int index] {
                get {
                    if (index < 0 || index >= InnerArray.GetCount(0)) {
                        throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                    }
  
                    return InnerArray.GetItem(index, 0);
                }
                set {
                    owner.CheckNoDataSource();
                    SetItem/*internal*/ public(index, value);
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Clear"]/*">
            /// <devdoc>
            ///     Removes all items from the ListBox.
            /// </devdoc>
            public virtual void Clear() {
                owner.CheckNoDataSource();
                Clear/*internal*/ public();
            }
 
            /// <devdoc>
            ///     Removes all items from the ListBox.  Bypasses the data source check.
            /// </devdoc>
            /*internal*/ public void Clear/*internal*/ public() {
 
                //update the width.. to reset Scrollbars..
                // Clear the selection state.
                //
                int cnt = owner.Items.Count;
                for (int i = 0; i < cnt; i++) {
                    owner.UpdateMaxItemWidth(InnerArray.GetItem(i, 0), true);
                }
  
 
                if (owner.IsHandleCreated) {
                    owner.NativeClear();
                }
                InnerArray.Clear();
                owner.maxWidth = -1;
                owner.UpdateHorizontalExtent();
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Contains"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public boolean Contains(Object value) {
                return IndexOf(value) != -1;
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.CopyTo"]/*">
            /// <devdoc>
            ///     Copies the ListBox Items collection to a destination array.
            /// </devdoc>
            public void CopyTo(Object[] destination, int arrayIndex) {
                int count = InnerArray.GetCount(0);
                for(int i = 0; i < count; i++) {
                    destination[i + arrayIndex] = InnerArray.GetItem(i, 0);
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ObjectCollection.ICollection.CopyTo"]/*">
            /// </*internal*/ publiconly>
            void ICollection.CopyTo(Array destination, int index) {
                int count = InnerArray.GetCount(0);
                for(int i = 0; i < count; i++) {
                    destination.SetValue(InnerArray.GetItem(i, 0), i + index);
                }
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.GetEnumerator"]/*">
            /// <devdoc>
            ///     Returns an enumerator for the ListBox Items collection.
            /// </devdoc>
            public IEnumerator GetEnumerator() {
                return InnerArray.GetEnumerator(0);
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.IndexOf"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            public int IndexOf(Object value) {
                if (value == null) {
                    throw new ArgumentNullException("value");
                }
  
                return InnerArray.IndexOf(value,0);
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.IndexOfIdentifier"]/*">
            /// <devdoc>
            ///    <para>[To be supplied.]</para>
            /// </devdoc>
            /// </*internal*/ publiconly>
            /*internal*/ public int IndexOfIdentifier(Object value) {
                if (value == null) {
                    throw new ArgumentNullException("value");
                }
  
                return InnerArray.IndexOfIdentifier(value,0);
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Insert"]/*">
            /// <devdoc>
            ///     Adds an item to the combo box. For an unsorted combo box, the item is
            ///     added to the end of the existing list of items. For a sorted combo box,
            ///     the item is inserted into the list according to its sorted position.
            ///     The item's toString() method is called to obtain the string that is
            ///     displayed in the combo box.
            ///     A SystemException occurs if there is insufficient space available to
            ///     store the new item.
            /// </devdoc>
            public void Insert(int index, Object item) {
                owner.CheckNoDataSource();
 
                if (index < 0 || index > InnerArray.GetCount(0)) {
                    throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                }
  
                if (item == null) {
                    throw new ArgumentNullException("item");
                }
 
                // If the combo box is sorted, then nust treat this like an add
                // because we are going to twiddle the index anyway.
                //
                if (owner.sorted) {
                    Add(item);
                }
                else {
                    InnerArray.Insert(index, item);
                    if (owner.IsHandleCreated) {
 
                        boolean successful = false;
  
                        try {
                            owner.NativeInsert(index, item);
                            owner.UpdateMaxItemWidth(item, false);
                            successful = true;
                        }
                        finally {
                            if (!successful) {
                                InnerArray.RemoveAt(index);
                            }
                        }
                    }
                }
                owner.UpdateHorizontalExtent();
            }
 
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.Remove"]/*">
            /// <devdoc>
            ///     Removes the given item from the ListBox, provided that it is
            ///     actually in the list.
            /// </devdoc>
            public void Remove(Object value) {
 
                int index = InnerArray.IndexOf(value, 0);
 
                if (index != -1) {
                    RemoveAt(index);
                }
            }
  
            /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.ObjectCollection.RemoveAt"]/*">
            /// <devdoc>
            ///     Removes an item from the ListBox at the given index.
            /// </devdoc>
            public void RemoveAt(int index) {
                owner.CheckNoDataSource();
  
                if (index < 0 || index >= InnerArray.GetCount(0)) {
                    throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                }
 
                owner.UpdateMaxItemWidth(InnerArray.GetItem(index, 0), true);
 
                // VSWhidbey 95181: Update InnerArray before calling NativeRemoveAt to ensure that when
                // SelectedIndexChanged is raised (by NativeRemoveAt), InnerArray's state matches wrapped LB state.
                InnerArray.RemoveAt(index);
 
                if (owner.IsHandleCreated) {
                    owner.NativeRemoveAt(index);
                }
  
                owner.UpdateHorizontalExtent();
            }
 
            /*internal*/ public void SetItem/*internal*/ public(int index, Object value) {
                if (value == null) {
                    throw new ArgumentNullException("value");
                }
 
                if (index < 0 || index >= InnerArray.GetCount(0)) {
                    throw new ArgumentOutOfRangeException("index", SR.GetString(SR.InvalidArgument, "index", (index).ToString(CultureInfo.CurrentCulture)));
                }
 
                owner.UpdateMaxItemWidth(InnerArray.GetItem(index, 0), true);
                InnerArray.SetItem(index, value);
  
                // If the native control has been created, and the display text of the new list item Object
                // is different to the current text in the native list item, recreate the native list item...
                if (owner.IsHandleCreated) {
                    boolean selected = (owner.SelectedIndex == index);
                    if (String.Compare(this.owner.GetItemText(value), this.owner.NativeGetItemText(index), true, CultureInfo.CurrentCulture) != 0) {
                        owner.NativeRemoveAt(index);
                        owner.SelectedItems.SetSelected(index, false);
                        owner.NativeInsert(index, value);
                        owner.UpdateMaxItemWidth(value, false);
                        if (selected) {
                            owner.SelectedIndex = index;
                        }
                    }
                    else {
                        // NEW - FOR COMPATIBILITY REASONS
                        // Minimum compatibility fix for VSWhidbey 377287
                        if (selected) {
                            owner.OnSelectedIndexChanged(EventArgs.Empty); //will fire selectedvaluechanged
                        }
                    }
                }
                owner.UpdateHorizontalExtent();
            }
        } // end ObjectCollection
  
        //*****************************************************************************************
        // IntegerCollection
        /// <include file="doc\ListBox.uex" path="docs/doc[@for="ListBox.IntegerCollection"]/*">
        /// <devdoc>
        ///    <para>[To be supplied.]</para>
        /// </devdoc>
        