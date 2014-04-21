/**
 * ArrayList
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ArrayList = declare("ArrayList", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(ArrayList.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	ArrayList.Type = new Type("ArrayList", ArrayList, [Object.Type]);
	return ArrayList;
});

// ==++== 
//
//   Copyright (c) Microsoft Corporation.  All rights reserved.
//
// ==--== 
/*============================================================
** 
** Class:  ArrayList 
**
** <OWNER>[....]</OWNER> 
**
**
** Purpose: Implements a dynamically sized List as an array,
**          and provides many convenience methods for treating 
**          an array as an IList.
** 
** 
===========================================================*/
namespace System.Collections { 
    using System;
    using System.Runtime;
    using System.Security;
    using System.Security.Permissions; 
    using System.Diagnostics;
    using System.Runtime.Serialization; 
    using System.Diagnostics.CodeAnalysis; 
    using System.Diagnostics.Contracts;
 
    // Implements a variable-size List that uses an array of objects to store the
    // elements. A ArrayList has a capacity, which is the allocated length
    // of the internal array. As elements are added to a ArrayList, the capacity
    // of the ArrayList is automatically increased as required by reallocating the 
    // internal array.
    // 
    public class ArrayList : IList, ICloneable
    {
        private Object[] _items; 
        private int _size; 
        private int _version; 
        private Object _syncRoot; 

        private const int _defaultCapacity = 4;
        private static readonly Object[] emptyArray = new Object[0];
 
        // Note: this constructor is a bogus constructor that does nothing
        // and is for use only with SyncArrayList. 
        internal ArrayList( bool trash ) 
        {
        } 

        // Constructs a ArrayList. The list is initially empty and has a capacity
        // of zero. Upon adding the first element to the list the capacity is
        // increased to _defaultCapacity, and then increased in multiples of two as required. 
        public ArrayList() {
            _items = emptyArray; 
        }

        // Constructs a ArrayList with a given initial capacity. The list is
        // initially empty, but will have room for the given number of elements 
        // before any reallocations are required.
        // 
         public ArrayList(int capacity) { 
             if (capacity < 0) throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_MustBeNonNegNum", "capacity"));
             Contract.EndContractBlock(); 

             if (capacity == 0)
                 _items = emptyArray;
             else 
                 _items = new Object[capacity];
        } 
 
        // Constructs a ArrayList, copying the contents of the given collection. The
        // size and capacity of the new list will both be equal to the size of the 
        // given collection.
        //
        public ArrayList(ICollection c) {
            if (c==null) 
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            Contract.EndContractBlock(); 
 
            int count = c.Count;
            if (count == 0) 
            {
                _items = emptyArray;
            }
            else { 
                _items = new Object[count];
                AddRange(c); 
            } 
        }
 
        // Gets and sets the capacity of this list.  The capacity is the size of
        // the internal array used to hold items.  When set, the internal
        // array of the list is reallocated to the given capacity.
        // 
         public virtual int Capacity {
            get { 
                Contract.Ensures(Contract.Result<int>() >= Count); 
                return _items.Length;
            } 
            set {
                if (value < _size) {
                    throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
                } 
                Contract.Ensures(Capacity >= 0);
                Contract.EndContractBlock(); 
                // We don't want to update the version number when we change the capacity. 
                // Some existing applications have dependency on this.
                if (value != _items.Length) { 
                    if (value > 0) {
                        Object[] newItems = new Object[value];
                        if (_size > 0) {
                            Array.Copy(_items, 0, newItems, 0, _size); 
                        }
                        _items = newItems; 
                    } 
                    else {
                        _items = new Object[_defaultCapacity]; 
                    }
                }
            }
        } 

        // Read-only property describing how many elements are in the List. 
        public virtual int Count { 
            get {
                Contract.Ensures(Contract.Result<int>() >= 0); 
                return _size;
            }
        }
 
        public virtual bool IsFixedSize {
            get { return false; } 
        } 

 
        // Is this ArrayList read-only?
        public virtual bool IsReadOnly {
            get { return false; }
        } 

        // Is this ArrayList synchronized (thread-safe)? 
        public virtual bool IsSynchronized { 
            get { return false; }
        } 

        // Synchronization root for this object.
        public virtual Object SyncRoot {
            get { 
                if( _syncRoot == null) {
                    System.Threading.Interlocked.CompareExchange<Object>(ref _syncRoot, new Object(), null); 
                } 
                return _syncRoot;
            } 
        }

        // Sets or Gets the element at the given index.
        // 
        public virtual Object this[int index] {
            get { 
                if (index < 0 || index >= _size) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index")); 
                Contract.EndContractBlock();
                return _items[index]; 
            }
            set {
                if (index < 0 || index >= _size) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
                Contract.EndContractBlock(); 
                _items[index] = value;
                _version++; 
            } 
        }
 
        // Creates a ArrayList wrapper for a particular IList.  This does not
        // copy the contents of the IList, but only wraps the ILIst.  So any
        // changes to the underlying list will affect the ArrayList.  This would
        // be useful if you want to Reverse a subrange of an IList, or want to 
        // use a generic BinarySearch or Sort method without implementing one yourself.
        // However, since these methods are generic, the performance may not be 
        // nearly as good for some operations as they would be on the IList itself. 
        //
        public static ArrayList Adapter(IList list) { 
            if (list==null)
                throw new ArgumentNullException("list");
            Contract.Ensures(Contract.Result<ArrayList>() != null);
            Contract.EndContractBlock(); 
            return new IListWrapper(list);
        } 
 
        // Adds the given object to the end of this list. The size of the list is
        // increased by one. If required, the capacity of the list is doubled 
        // before adding the new element.
        //
        public virtual int Add(Object value) {
            Contract.Ensures(Contract.Result<int>() >= 0); 
            if (_size == _items.Length) EnsureCapacity(_size + 1);
            _items[_size] = value; 
            _version++; 
            return _size++;
        } 

        // Adds the elements of the given collection to the end of this list. If
        // required, the capacity of the list is increased to twice the previous
        // capacity or the new size, whichever is larger. 
        //
        public virtual void AddRange(ICollection c) { 
            InsertRange(_size, c);
        }

        // Searches a section of the list for a given element using a binary search 
        // algorithm. Elements of the list are compared to the search value using
        // the given IComparer interface. If comparer is null, elements of 
        // the list are compared to the search value using the IComparable 
        // interface, which in that case must be implemented by all elements of the
        // list and the given search value. This method assumes that the given 
        // section of the list is already sorted; if this is not the case, the
        // result will be incorrect.
        //
        // The method returns the index of the given value in the list. If the 
        // list does not contain the given value, the method returns a negative
        // integer. The bitwise complement operator (~) can be applied to a 
        // negative result to produce the index of the first element (if any) that 
        // is larger than the given search value. This is also the index at which
        // the search value should be inserted into the list in order for the list 
        // to remain sorted.
        //
        // The method uses the Array.BinarySearch method to perform the
        // search. 
        //
        public virtual int BinarySearch(int index, int count, Object value, IComparer comparer) { 
            if (index < 0) 
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (_size - index < count)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            Contract.Ensures(Contract.Result<int>() < Count); 
            Contract.Ensures(Contract.Result<int>() < index + count);
            Contract.EndContractBlock(); 
 
            return Array.BinarySearch((Array)_items, index, count, value, comparer);
        } 

        public virtual int BinarySearch(Object value)
        {
            Contract.Ensures(Contract.Result<int>() < Count); 
            return BinarySearch(0, Count, value, null);
        } 
 
        public virtual int BinarySearch(Object value, IComparer comparer)
        { 
            Contract.Ensures(Contract.Result<int>() < Count);
            return BinarySearch(0, Count, value, comparer);
        }
 

        // Clears the contents of ArrayList. 
        public virtual void Clear() { 
            if (_size > 0)
            { 
            Array.Clear(_items, 0, _size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
            _size = 0;
            }
            _version++; 
        }
 
        // Clones this ArrayList, doing a shallow copy.  (A copy is made of all 
        // Object references in the ArrayList, but the Objects pointed to
        // are not cloned). 
        public virtual Object Clone()
        {
            Contract.Ensures(Contract.Result<Object>() != null);
            ArrayList la = new ArrayList(_size); 
            la._size = _size;
            la._version = _version; 
            Array.Copy(_items, 0, la._items, 0, _size); 
            return la;
        } 


        // Contains returns true if the specified element is in the ArrayList.
        // It does a linear, O(n) search.  Equality is determined by calling 
        // item.Equals().
        // 
        public virtual bool Contains(Object item) { 
            if (item==null) {
                for(int i=0; i<_size; i++) 
                    if (_items[i]==null)
                        return true;
                return false;
            } 
            else {
                for(int i=0; i<_size; i++) 
                    if ( (_items[i] != null) && (_items[i].Equals(item)) ) 
                        return true;
                return false; 
            }
        }

        // Copies this ArrayList into array, which must be of a 
        // compatible array type.
        // 
        public virtual void CopyTo(Array array) { 
            CopyTo(array, 0);
        } 

        // Copies this ArrayList into array, which must be of a
        // compatible array type.
        // 
        public virtual void CopyTo(Array array, int arrayIndex) {
            if ((array != null) && (array.Rank != 1)) 
                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported")); 
            Contract.EndContractBlock();
            // Delegate rest of error checking to Array.Copy. 
            Array.Copy(_items, 0, array, arrayIndex, _size);
        }

        // Copies a section of this list to the given array at the given index. 
        //
        // The method uses the Array.Copy method to copy the elements. 
        // 
        public virtual void CopyTo(int index, Array array, int arrayIndex, int count) {
            if (_size - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            if ((array != null) && (array.Rank != 1))
                throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
            Contract.EndContractBlock(); 
            // Delegate rest of error checking to Array.Copy.
            Array.Copy(_items, index, array, arrayIndex, count); 
        } 

        // Ensures that the capacity of this list is at least the given minimum 
        // value. If the currect capacity of the list is less than min, the
        // capacity is increased to twice the current capacity or to min,
        // whichever is larger.
        private void EnsureCapacity(int min) { 
            if (_items.Length < min) {
                int newCapacity = _items.Length == 0? _defaultCapacity: _items.Length * 2; 
                // Allow the list to grow to maximum possible capacity (~2G elements) before encountering overflow. 
                // Note that this check works even when _items.Length overflowed thanks to the (uint) cast
                if ((uint)newCapacity > Array.MaxArrayLength) newCapacity = Array.MaxArrayLength; 
                if (newCapacity < min) newCapacity = min;
                Capacity = newCapacity;
            }
        } 

        // Returns a list wrapper that is fixed at the current size.  Operations 
        // that add or remove items will fail, however, replacing items is allowed. 
        //
        public static IList FixedSize(IList list) { 
            if (list==null)
                throw new ArgumentNullException("list");
            Contract.Ensures(Contract.Result<IList>() != null);
            Contract.EndContractBlock(); 
            return new FixedSizeList(list);
        } 
 
        // Returns a list wrapper that is fixed at the current size.  Operations
        // that add or remove items will fail, however, replacing items is allowed. 
        //
        public static ArrayList FixedSize(ArrayList list) {
            if (list==null)
                throw new ArgumentNullException("list"); 
            Contract.Ensures(Contract.Result<ArrayList>() != null);
            Contract.EndContractBlock(); 
            return new FixedSizeArrayList(list); 
        }
 
        // Returns an enumerator for this list with the given
        // permission for removal of elements. If modifications made to the list
        // while an enumeration is in progress, the MoveNext and
        // GetObject methods of the enumerator will throw an exception. 
        //
        public virtual IEnumerator GetEnumerator() { 
            Contract.Ensures(Contract.Result<IEnumerator>() != null);
            return new ArrayListEnumeratorSimple(this);
        }
 
        // Returns an enumerator for a section of this list with the given
        // permission for removal of elements. If modifications made to the list 
        // while an enumeration is in progress, the MoveNext and 
        // GetObject methods of the enumerator will throw an exception.
        // 
        public virtual IEnumerator GetEnumerator(int index, int count) { 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (_size - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            Contract.Ensures(Contract.Result<IEnumerator>() != null);
            Contract.EndContractBlock();
 
            return new ArrayListEnumerator(this, index, count);
        } 
 
        // Returns the index of the first occurrence of a given value in a range of
        // this list. The list is searched forwards from beginning to end. 
        // The elements of the list are compared to the given value using the
        // Object.Equals method.
        //
        // This method uses the Array.IndexOf method to perform the 
        // search.
        // 
        public virtual int IndexOf(Object value) {
            Contract.Ensures(Contract.Result<int>() < Count);
            return Array.IndexOf((Array)_items, value, 0, _size);
        } 

        // Returns the index of the first occurrence of a given value in a range of 
        // this list. The list is searched forwards, starting at index 
        // startIndex and ending at count number of elements. The
        // elements of the list are compared to the given value using the 
        // Object.Equals method.
        //
        // This method uses the Array.IndexOf method to perform the
        // search. 
        //
        public virtual int IndexOf(Object value, int startIndex) { 
            if (startIndex > _size) 
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            Contract.Ensures(Contract.Result<int>() < Count); 
            Contract.EndContractBlock();
            return Array.IndexOf((Array)_items, value, startIndex, _size - startIndex);
        }
 
        // Returns the index of the first occurrence of a given value in a range of
        // this list. The list is searched forwards, starting at index 
        // startIndex and upto count number of elements. The 
        // elements of the list are compared to the given value using the
        // Object.Equals method. 
        //
        // This method uses the Array.IndexOf method to perform the
        // search.
        // 
        public virtual int IndexOf(Object value, int startIndex, int count) {
            if (startIndex > _size) 
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index")); 
            if (count <0 || startIndex > _size - count) throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
            Contract.Ensures(Contract.Result<int>() < Count); 
            Contract.EndContractBlock();
            return Array.IndexOf((Array)_items, value, startIndex, count);
        }
 
        // Inserts an element into this list at a given index. The size of the list
        // is increased by one. If required, the capacity of the list is doubled 
        // before inserting the new element. 
        //
        public virtual void Insert(int index, Object value) { 
            // Note that insertions at the end are legal.
            if (index < 0 || index > _size) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_ArrayListInsert"));
            //Contract.Ensures(Count == Contract.OldValue(Count) + 1);
            Contract.EndContractBlock(); 

            if (_size == _items.Length) EnsureCapacity(_size + 1); 
            if (index < _size) { 
                Array.Copy(_items, index, _items, index + 1, _size - index);
            } 
            _items[index] = value;
            _size++;
            _version++;
        } 

        // Inserts the elements of the given collection at a given index. If 
        // required, the capacity of the list is increased to twice the previous 
        // capacity or the new size, whichever is larger.  Ranges may be added
        // to the end of the list by setting index to the ArrayList's size. 
        //
        public virtual void InsertRange(int index, ICollection c) {
            if (c==null)
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection")); 
            if (index < 0 || index > _size) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            //Contract.Ensures(Count == Contract.OldValue(Count) + c.Count); 
            Contract.EndContractBlock(); 

            int count = c.Count; 
            if (count > 0) {
                EnsureCapacity(_size + count);
                // shift existing items
                if (index < _size) { 
                    Array.Copy(_items, index, _items, index + count, _size - index);
                } 
 
                Object[] itemsToInsert = new Object[count];
                c.CopyTo(itemsToInsert, 0); 
                itemsToInsert.CopyTo(_items, index);
                _size += count;
                _version++;
            } 
        }
 
        // Returns the index of the last occurrence of a given value in a range of 
        // this list. The list is searched backwards, starting at the end
        // and ending at the first element in the list. The elements of the list 
        // are compared to the given value using the Object.Equals method.
        //
        // This method uses the Array.LastIndexOf method to perform the
        // search. 
        //
        public virtual int LastIndexOf(Object value) 
        { 
            Contract.Ensures(Contract.Result<int>() < _size);
            return LastIndexOf(value, _size - 1, _size); 
        }

        // Returns the index of the last occurrence of a given value in a range of
        // this list. The list is searched backwards, starting at index 
        // startIndex and ending at the first element in the list. The
        // elements of the list are compared to the given value using the 
        // Object.Equals method. 
        //
        // This method uses the Array.LastIndexOf method to perform the 
        // search.
        //
        public virtual int LastIndexOf(Object value, int startIndex)
        { 
            if (startIndex >= _size)
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index")); 
            Contract.Ensures(Contract.Result<int>() < Count); 
            Contract.EndContractBlock();
            return LastIndexOf(value, startIndex, startIndex + 1); 
        }

        // Returns the index of the last occurrence of a given value in a range of
        // this list. The list is searched backwards, starting at index 
        // startIndex and upto count elements. The elements of
        // the list are compared to the given value using the Object.Equals 
        // method. 
        //
        // This method uses the Array.LastIndexOf method to perform the 
        // search.
        //
        public virtual int LastIndexOf(Object value, int startIndex, int count) {
            if (Count != 0 && (startIndex < 0 || count < 0)) 
                throw new ArgumentOutOfRangeException((startIndex<0 ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            Contract.Ensures(Contract.Result<int>() < Count); 
            Contract.EndContractBlock(); 

            if (_size == 0)  // Special case for an empty list 
                return -1;

            if (startIndex >= _size || count > startIndex + 1)
                throw new ArgumentOutOfRangeException((startIndex>=_size ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_BiggerThanCollection")); 

            return Array.LastIndexOf((Array)_items, value, startIndex, count); 
        } 

        // Returns a read-only IList wrapper for the given IList. 
        //
        public static IList ReadOnly(IList list) {
            if (list==null)
                throw new ArgumentNullException("list"); 
            Contract.Ensures(Contract.Result<IList>() != null);
            Contract.EndContractBlock(); 
            return new ReadOnlyList(list); 
        }
 
        // Returns a read-only ArrayList wrapper for the given ArrayList.
        //
        public static ArrayList ReadOnly(ArrayList list) {
            if (list==null) 
                throw new ArgumentNullException("list");
            Contract.Ensures(Contract.Result<ArrayList>() != null); 
            Contract.EndContractBlock(); 
            return new ReadOnlyArrayList(list);
        } 

        // Removes the element at the given index. The size of the list is
        // decreased by one.
        // 
        public virtual void Remove(Object obj) {
            Contract.Ensures(Count >= 0); 

            int index = IndexOf(obj);
            BCLDebug.Correctness(index >= 0 || !(obj is Int32), "You passed an Int32 to Remove that wasn't in the ArrayList." + Environment.NewLine + "Did you mean RemoveAt?  int: "+obj+"  Count: "+Count);
            if (index >=0) 
                RemoveAt(index);
        } 
 
        // Removes the element at the given index. The size of the list is
        // decreased by one. 
        //
        public virtual void RemoveAt(int index) {
            if (index < 0 || index >= _size) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            Contract.Ensures(Count >= 0); 
            //Contract.Ensures(Count == Contract.OldValue(Count) - 1);
            Contract.EndContractBlock(); 
 
            _size--;
            if (index < _size) { 
                Array.Copy(_items, index + 1, _items, index, _size - index);
            }
            _items[_size] = null;
            _version++; 
        }
 
        // Removes a range of elements from this list. 
        //
        public virtual void RemoveRange(int index, int count) { 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0)
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (_size - index < count)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen")); 
            Contract.Ensures(Count >= 0); 
            //Contract.Ensures(Count == Contract.OldValue(Count) - count);
            Contract.EndContractBlock(); 

            if (count > 0) {
                int i = _size;
                _size -= count; 
                if (index < _size) {
                    Array.Copy(_items, index + count, _items, index, _size - index); 
                } 
                while (i > _size) _items[--i] = null;
                _version++; 
            }
        }

        // Returns an IList that contains count copies of value. 
        //
        public static ArrayList Repeat(Object value, int count) { 
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count",Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            Contract.Ensures(Contract.Result<ArrayList>() != null); 
            Contract.EndContractBlock();

            ArrayList list = new ArrayList((count>_defaultCapacity)?count:_defaultCapacity);
            for(int i=0; i<count; i++) 
                list.Add(value);
            return list; 
        } 

        // Reverses the elements in this list. 
        public virtual void Reverse() {
            Reverse(0, Count);
        }
 
        // Reverses the elements in a range of this list. Following a call to this
        // method, an element in the range given by index and count 
        // which was previously located at index i will now be located at 
        // index index + (index + count - i - 1).
        // 
        // This method uses the Array.Reverse method to reverse the
        // elements.
        //
        public virtual void Reverse(int index, int count) { 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (_size - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            Contract.EndContractBlock();
            Array.Reverse(_items, index, count);
            _version++; 
        }
 
        // Sets the elements starting at the given index to the elements of the 
        // given collection.
        // 
        public virtual void SetRange(int index, ICollection c) {
            if (c==null) throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            Contract.EndContractBlock();
            int count = c.Count; 
            if (index < 0 || index > _size - count) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
 
            if (count > 0) { 
                c.CopyTo(_items, index);
                _version++; 
            }
        }

        public virtual ArrayList GetRange(int index, int count) { 
            if (index < 0 || count < 0)
                throw new ArgumentOutOfRangeException((index<0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (_size - index < count) 
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            Contract.Ensures(Contract.Result<ArrayList>() != null); 
            Contract.EndContractBlock();
            return new Range(this,index, count);
        }
 
        // Sorts the elements in this list.  Uses the default comparer and
        // Array.Sort. 
        public virtual void Sort() 
        {
            Sort(0, Count, Comparer.Default); 
        }

        // Sorts the elements in this list.  Uses Array.Sort with the
        // provided comparer. 
        public virtual void Sort(IComparer comparer)
        { 
            Sort(0, Count, comparer); 
        }
 
        // Sorts the elements in a section of this list. The sort compares the
        // elements to each other using the given IComparer interface. If
        // comparer is null, the elements are compared to each other using
        // the IComparable interface, which in that case must be implemented by all 
        // elements of the list.
        // 
        // This method uses the Array.Sort method to sort the elements. 
        //
        public virtual void Sort(int index, int count, IComparer comparer) { 
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0)
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum")); 
            if (_size - index < count)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen")); 
            Contract.EndContractBlock(); 

            Array.Sort(_items, index, count, comparer); 
            _version++;
        }

        // Returns a thread-safe wrapper around an IList. 
        //
        public static IList Synchronized(IList list) { 
            if (list==null)
                throw new ArgumentNullException("list"); 
            Contract.Ensures(Contract.Result<IList>() != null);
            Contract.EndContractBlock();
            return new SyncIList(list);
        } 

        // Returns a thread-safe wrapper around a ArrayList. 
        // 
        public static ArrayList Synchronized(ArrayList list) { 
            if (list==null)
                throw new ArgumentNullException("list");
            Contract.Ensures(Contract.Result<ArrayList>() != null);
            Contract.EndContractBlock(); 
            return new SyncArrayList(list);
        } 
 
        // ToArray returns a new Object array containing the contents of the ArrayList.
        // This requires copying the ArrayList, which is an O(n) operation. 
        public virtual Object[] ToArray() {
            Contract.Ensures(Contract.Result<Object[]>() != null);

            Object[] array = new Object[_size]; 
            Array.Copy(_items, 0, array, 0, _size);
            return array; 
        } 

        // ToArray returns a new array of a particular type containing the contents 
        // of the ArrayList.  This requires copying the ArrayList and potentially
        // downcasting all elements.  This copy may fail and is an O(n) operation.
        // Internally, this implementation calls Array.Copy.
        // 
        public virtual Array ToArray(Type type) { 
            if (type==null) 
                throw new ArgumentNullException("type");
            Contract.Ensures(Contract.Result<Array>() != null); 
            Contract.EndContractBlock();
            Array array = Array.UnsafeCreateInstance(type, _size);
            Array.Copy(_items, 0, array, 0, _size);
            return array; 
        }
 
        // Sets the capacity of this list to the size of the list. This method can 
        // be used to minimize a list's memory overhead once it is known that no
        // new elements will be added to the list. To completely clear a list and 
        // release all memory referenced by the list, execute the following
        // statements:
        //
        // list.Clear(); 
        // list.TrimToSize();
        // 
        public virtual void TrimToSize() { 
            Capacity = _size;
        } 


 
        // Implements an enumerator for a ArrayList. The enumerator uses the
        // internal version number of the list to ensure that no modifications are
        // made to the list while an enumeration is in progress.
        private sealed class ArrayListEnumerator : IEnumerator, ICloneable
        { 
            private ArrayList list; 
            private int index;
            private int endIndex;       // Where to stop. 
            private int version;
            private Object currentElement;
            private int startIndex;     // Save this for Reset.
 
            internal ArrayListEnumerator(ArrayList list, int index, int count) {
                this.list = list; 
                startIndex = index; 
                this.index = index - 1;
                endIndex = this.index + count;  // last valid index 
                version = list._version;
                currentElement = null;
            }
 
            public Object Clone() {
                return MemberwiseClone(); 
            } 

            public bool MoveNext() { 
                if (version != list._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion));
                if (index < endIndex) {
                    currentElement = list[++index];
                    return true; 
                }
                else { 
                    index = endIndex + 1; 
                }
 
                return false;
            }

            public Object Current { 
                get {
                    if (index < startIndex) 
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumNotStarted)); 
                    else if (index > endIndex) {
                        throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumEnded)); 
                    }
                    return currentElement;
                }
            } 

            public void Reset() { 
                if (version != list._version) throw new InvalidOperationException(Environment.GetResourceString(ResId.InvalidOperation_EnumFailedVersion)); 
                index = startIndex - 1;
            } 
        }
    } 
} 