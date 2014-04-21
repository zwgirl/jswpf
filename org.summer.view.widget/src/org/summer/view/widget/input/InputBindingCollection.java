package org.summer.view.widget.input;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.collection.List;

/// <summary> 
/// InputBindingCollection - Collection of InputBindings.
///     Stores the InputBindings Sequentially in an System.Collections.Generic.List"InputBinding"a. 
///     Will be changed to generic List implementation once the 
///     parser supports generic collections.
/// </summary> 
public /*sealed*/ class InputBindingCollection implements IList
{
    //-----------------------------------------------------
    // 
    //  Constructors
    // 
    //----------------------------------------------------- 
//    #region Constructors
    /// <summary> 
    /// Constructor
    /// </summary>
    public InputBindingCollection()
    { 
    }

    /// <summary> 
    /// InputBindingCollection
    /// </summary> 
    /// <param name="inputBindings">InputBinding array</param>
    public InputBindingCollection(IList inputBindings)
    {
        if (inputBindings != null && inputBindings.Count > 0) 
        {
            this.AddRange(inputBindings as ICollection); 
        } 
    }

    /// <summary>
    ///     /*internal*/ public Constructor
    /// </summary>
    /*internal*/ public InputBindingCollection(DependencyObject owner) 
    {
        _owner = owner; 
    } 

//    #endregion Constructors 

    //------------------------------------------------------
    //
    //  Public Methods 
    //
    //----------------------------------------------------- 

//    #region Public Methods

//#region Implementation of IList

//#region Implementation of ICollection
    /// <summary> 
    /// CopyTo - to copy the entire collection into an array
    /// </summary> 
    /// <param name="array">generic Object array</param> 
    /// <param name="index"></param>
    void ICollection.CopyTo(System.Array array, int index) 
    {
        if (_innerBindingList != null)
        {
            ((ICollection)_innerBindingList).CopyTo(array, index); 
        }
    } 
//#endregion Implementation of ICollection 

    /// <summary> 
    /// IList.Contains
    /// </summary>
    /// <param name="key">key</param>
    /// <returns>true - if found, false - otherwise</returns> 
    boolean IList.Contains(Object key)
    { 
        return this.Contains(key as InputBinding); 
    }

    /// <summary>
    /// IndexOf - returns the index of the item in the list
    /// </summary>
    /// <param name="value">item whose index is sought</param> 
    /// <returns>index of the item or -1 </returns>
    int IList.IndexOf(Object value) 
    { 
        InputBinding inputBinding = value as InputBinding;
        return ((inputBinding != null) ? this.IndexOf(inputBinding) : -1); 
    }

    /// <summary>
    ///  Insert 
    /// </summary>
    /// <param name="index"></param> 
    /// <param name="value"></param> 
    void IList.Insert(int index, Object value)
    { 
        this.Insert(index, value as InputBinding);
    }

    /// <summary> 
    /// Add - appends the given inputbinding to the current list.
    /// </summary> 
    /// <param name="inputBinding">InputBinding Object to add</param> 
    int IList.Add(Object inputBinding)
    { 
        this.Add(inputBinding as InputBinding);
        return 0; // ICollection.Add no longer returns the indice
    }

    /// <summary>
    /// Remove - removes the given inputbinding from the current list. 
    /// </summary> 
    /// <param name="inputBinding">InputBinding Object to remove</param>
    void IList.Remove(Object inputBinding) 
    {
        this.Remove(inputBinding as InputBinding);
    }

    /// <summary>
    /// Indexing operator 
    /// </summary> 
    Object IList.this[int index]
    { 
        get
        {
            return this[index];
        } 
        set
        { 
            InputBinding inputBinding = value as InputBinding; 
            if (inputBinding == null)
               throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings)); 

            this[index] = inputBinding;
        }
    } 

//#endregion Implementation of IList 
    /// <summary> 
    /// Indexing operator
    /// </summary> 
    public InputBinding this[int index]
    {
        get
        { 
            // disable PreSharp warning about throwing exceptions in getter;
            // this is allowed in an indexed property.  (First disable C# 
            // warning about unknown warning numbers.) 
//            #pragma warning disable 1634, 1691
//            #pragma warning disable 6503 

            if (_innerBindingList != null)
            {
                return _innerBindingList[index]; 
            }
            else 
            { 
                throw new ArgumentOutOfRangeException("index");
            } 

//            #pragma warning restore 6503
//            #pragma warning restore 1634, 1691
        } 
        set
        { 
            if (_innerBindingList != null) 
            {
                InputBinding oldInputBinding = null; 
                if (index >= 0 && index < _innerBindingList.Count)
                {
                    oldInputBinding = _innerBindingList[index];
                } 
                _innerBindingList[index] = value;
                if (oldInputBinding != null) 
                { 
                    InheritanceContextHelper.RemoveContextFromObject(_owner, oldInputBinding);
                } 
                InheritanceContextHelper.ProvideContextForObject(_owner, value);
            }
            else
            { 
                throw new ArgumentOutOfRangeException("index");
            } 
        } 
    }

    /// <summary>
    /// Add
    /// </summary>
    /// <param name="inputBinding"></param> 
    public int Add(InputBinding inputBinding)
    { 
        if (inputBinding != null) 
        {
            if (_innerBindingList == null) 
                _innerBindingList = new System.Collections.Generic.List<InputBinding>(1);

            _innerBindingList.Add(inputBinding);
            InheritanceContextHelper.ProvideContextForObject(_owner, inputBinding); 
            return 0; // ICollection.Add no longer returns the indice
        } 
        else 
        {
            throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings)); 
        }
    }

    /// <summary> 
    /// ICollection.IsSynchronized
    /// </summary> 
    public boolean IsSynchronized 
    {
        get 
        {
            if (_innerBindingList != null)
                return ((IList)_innerBindingList).IsSynchronized;

            return false;
        } 
    } 

    /// <summary> 
    /// IndexOf
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns> 
    public int IndexOf(InputBinding value)
    { 
        return (_innerBindingList != null) ? _innerBindingList.IndexOf(value) : -1; 
    }

    /// <summary>
    /// Adds the elements of the given collection to the end of this list. If
    /// required, the capacity of the list is increased to twice the previous
    /// capacity or the new size, whichever is larger. 
    /// </summary>
    /// <param name="collection">collection to append</param> 
    public void AddRange(ICollection collection) 
    {
        if (collection == null) 
        {
            throw new ArgumentNullException("collection");
        }

        if ( collection.Count > 0)
        { 
            if (_innerBindingList == null) 
                _innerBindingList = new System.Collections.Generic.List<InputBinding>(collection.Count);

            IEnumerator collectionEnum = collection.GetEnumerator();
            while(collectionEnum.MoveNext())
            {
                InputBinding inputBinding = collectionEnum.Current as InputBinding; 
                if (inputBinding != null)
                { 
                    _innerBindingList.Add(inputBinding); 
                    InheritanceContextHelper.ProvideContextForObject(_owner, inputBinding);
                } 
                else
                {
                    throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings));
                } 
            }
        } 
    } 

    /// <summary> 
    ///  Insert at given index
    /// </summary>
    /// <param name="index">index at which to insert the given item</param>
    /// <param name="inputBinding">inputBinding to insert</param> 
    public void Insert(int index, InputBinding inputBinding)
    { 
        if (inputBinding == null) 
        {
            throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsInputBindings)); 
        }

        if (_innerBindingList != null)
        { 
            _innerBindingList.Insert(index, inputBinding);
            InheritanceContextHelper.ProvideContextForObject(_owner, inputBinding); 
        } 
    }

    /// <summary>
    /// Remove
    /// </summary>
    /// <param name="inputBinding"></param> 
    public void Remove(InputBinding inputBinding)
    { 
        if (_innerBindingList != null && inputBinding != null) 
        {
            if (_innerBindingList.Remove(inputBinding as InputBinding)) 
            {
                InheritanceContextHelper.RemoveContextFromObject(_owner, inputBinding);
            }
        } 
    }

    /// <summary> 
    /// RemoveAt
    /// </summary> 
    /// <param name="index">index at which the item needs to be removed</param>
    public void RemoveAt(int index)
    {
        if (_innerBindingList != null) 
        {
            InputBinding oldInputBinding = null; 
            if (index >= 0 && index < _innerBindingList.Count) 
            {
                oldInputBinding = _innerBindingList[index]; 
            }
            _innerBindingList.RemoveAt(index);
            if (oldInputBinding != null)
            { 
                InheritanceContextHelper.RemoveContextFromObject(_owner, oldInputBinding);
            } 
        } 
    }

    /// <summary>
    /// IsFixedSize - if readonly - fixed, else false.
    /// </summary>
    public boolean IsFixedSize 
    {
        get { return IsReadOnly; } 
    } 

    /// <summary> 
    /// Count
    /// </summary>
    public int Count
    { 
        get
        { 
            return (_innerBindingList != null ? _innerBindingList.Count : 0); 
        }
    } 

    /// <summary>
    /// ICollection.SyncRoot
    /// </summary> 
    public Object SyncRoot
    { 
        get 
        {
            return this; 
        }
    }

    /// <summary> 
    /// Clears the Entire InputBindingCollection
    /// </summary> 
    public void Clear() 
    {
        if (_innerBindingList != null) 
        {
            List<InputBinding> oldInputBindings = new List<InputBinding>(_innerBindingList);
            _innerBindingList.Clear();
            _innerBindingList = null; 
            foreach (InputBinding inputBinding in oldInputBindings)
            { 
                InheritanceContextHelper.RemoveContextFromObject(_owner, inputBinding); 
            }
        } 
    }

//#region Implementation of Enumerable
    /// <summary> 
    /// IEnumerable.GetEnumerator - For Enumeration purposes
    /// </summary> 
    /// <returns></returns> 
    public IEnumerator GetEnumerator()
    { 
        if (_innerBindingList != null)
            return _innerBindingList.GetEnumerator();

        System.Collections.Generic.List<InputBinding> list = new System.Collections.Generic.List<InputBinding>(0); 
        return list.GetEnumerator();
    } 
//#endregion Implementation of IEnumberable 

    /// <summary> 
    /// IList.IsReadOnly - Tells whether this is readonly Collection.
    /// </summary>
    public boolean IsReadOnly
    { 
        get { return _isReadOnly; }
    } 

    /// <summary>
    /// Contains 
    /// </summary>
    /// <param name="key">key</param>
    /// <returns>true - if found, false - otherwise</returns>
    public boolean Contains(InputBinding key) 
    {
        if (_innerBindingList != null && key != null) 
        { 
            return _innerBindingList.Contains(key);
        } 

        return false;
    }

    /// <summary>
    /// CopyTo - to copy the entire collection into an array 
    /// </summary> 
    /// <param name="inputBindings">type-safe InputBinding array</param>
    /// <param name="index">start index in the current list to copy</param> 
    public void CopyTo(InputBinding[] inputBindings, int index)
    {
        if (_innerBindingList != null)
        { 
            _innerBindingList.CopyTo(inputBindings, index);
        } 
    } 
//#endregion Public

//#region /*internal*/

    /*internal*/ public InputBinding FindMatch(Object targetElement, InputEventArgs inputEventArgs)
    { 
        for (int i = Count - 1; i >= 0; i--)
        { 
            InputBinding inputBinding = this[i]; 
            if ((inputBinding.Command != null) && (inputBinding.Gesture != null) &&
                inputBinding.Gesture.Matches(targetElement, inputEventArgs)) 
            {
                return inputBinding;
            }
        } 

        return null; 
    } 

//#endregion /*internal*/ public 
    //------------------------------------------------------
    //
    //  Protected Methods
    // 
    //------------------------------------------------------
    //----------------------------------------------------- 
    // 
    //  Private Methods
    // 
    //------------------------------------------------------
    //-----------------------------------------------------
    //
    //  Private Fields 
    //
    //----------------------------------------------------- 
//#region Private Fields 
    private List<InputBinding> _innerBindingList;
    private boolean  _isReadOnly = false; 
    private DependencyObject _owner = null;
//#endregion Private Fields
}