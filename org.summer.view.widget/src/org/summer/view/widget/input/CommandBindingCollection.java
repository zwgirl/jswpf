package org.summer.view.widget.input;

import java.lang.reflect.Array;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;

/// <summary>
/// CommandBindingCollection - Collection of CommandBindings. 
///     Stores the CommandBindings Sequentially in an System.Collections.Generic.List"CommandBinding".
///     Will be changed to generic List implementation once the 
///     parser supports generic collections. 
/// </summary>
public /*sealed*/ class CommandBindingCollection implements IList 
{
    //-----------------------------------------------------
    //
    //  Constructors 
    //
    //----------------------------------------------------- 
//#region Constructors 
    /// <summary>
    /// Constructor 
    /// </summary>
    public CommandBindingCollection()
    {
    } 

    /// <summary> 
    /// CommandBindingCollection 
    /// </summary>
    /// <param name="commandBindings">CommandBinding array</param> 
    public CommandBindingCollection(IList commandBindings)
    {
        if (commandBindings != null && commandBindings.Count > 0)
        { 
            AddRange(commandBindings as ICollection);
        } 
    } 

//#endregion Constructors 

    //------------------------------------------------------
    //
    //  Public Methods 
    //
    //----------------------------------------------------- 

//#region Public Methods

//#region Implementation of IList

//    #region Implementation of ICollection
    /// <summary> 
    /// CopyTo - to copy the entire collection into an array
    /// </summary> 
    /// <param name="array">commandbinding array to copy into</param> 
    /// <param name="index">start index in current list to copy</param>
    public void /*ICollection.*/CopyTo(/*System.*/Array array, int index) 
    {
        if (_innerCBList != null)
        {
            ((ICollection)_innerCBList).CopyTo(array, index); 
        }
    } 

//#endregion Implementation of ICollection
    /// <summary> 
    /// IList.Contains
    /// </summary>
    /// <param name="key">key</param>
    /// <returns>true - if found, false - otherwise</returns> 
    public Object /*IList.*/Contains(Object key)
    { 
         return this.Contains(key as CommandBinding) ; 
    }

    /// <summary>
    /// IndexOf
    /// </summary>
    /// <param name="value">item whose index is queried</param> 
    /// <returns></returns>
    public int /*IList.*/IndexOf(Object value) 
    { 
        CommandBinding commandBinding = value as CommandBinding;
        return ((commandBinding != null) ? this.IndexOf(commandBinding) : -1); 
    }

    /// <summary>
    ///  Insert 
    /// </summary>
    /// <param name="index">index at which to insert the given item</param> 
    /// <param name="value">item to insert</param> 
    public void /*IList.*/Insert(int index, Object value)
    { 
        this.Insert(index, value as CommandBinding);
    }

    /// <summary> 
    /// Add
    /// </summary> 
    /// <param name="commandBinding">CommandBinding Object to add</param> 
    public int /*IList.*/Add(Object commandBinding)
    { 
        return this.Add(commandBinding as CommandBinding);
    }

    /// <summary> 
    /// Remove
    /// </summary> 
    /// <param name="commandBinding">CommandBinding Object to remove</param> 
    public void /*IList.*/Remove(Object commandBinding)
    { 
        this.Remove(commandBinding as CommandBinding);
    }

    /// <summary> 
    /// Indexing operator
    /// </summary> 
    public Object /*IList.*/this[int index] 
    {
        get 
        {
            return this[index];
        }
        set 
        {
            CommandBinding commandBinding = value as CommandBinding; 
            if (commandBinding == null) 
                throw new NotSupportedException(/*SR.Get(SRID.CollectionOnlyAcceptsCommandBindings)*/);

            this[index] = commandBinding;
        }
    }
//#endregion Implementation of IList 
    /// <summary>
    /// Indexing operator 
    /// </summary> 
    public CommandBinding  this[int index]
    { 
        get
        {
            return (_innerCBList != null ? _innerCBList[index] : null);
        } 
        set
        { 
            if (_innerCBList != null) 
            {
                _innerCBList[index] = value; 
            }
        }
    }

    /// <summary>
    /// Add 
    /// </summary> 
    /// <param name="commandBinding">commandBinding to add</param>
    public int Add(CommandBinding commandBinding) 
    {
        if (commandBinding != null)
        {
            if (_innerCBList == null) 
                _innerCBList = new /*System.Collections.Generic.*/List<CommandBinding>(1);

            _innerCBList.Add(commandBinding); 
            return 0; // ICollection.Add no longer returns the indice
        } 
        else
        {
            throw new NotSupportedException(/*SR.Get(SRID.CollectionOnlyAcceptsCommandBindings)*/);
        } 
    }

    /// <summary> 
    /// Adds the elements of the given collection to the end of this list. If
    /// required, the capacity of the list is increased to twice the previous 
    /// capacity or the new size, whichever is larger.
    /// </summary>
    /// <param name="collection">collection to append</param>
    public void AddRange(ICollection collection) 
    {
        if (collection==null) 
            throw new ArgumentNullException("collection"); 

        if (collection.Count > 0) 
        {
             if (_innerCBList == null)
                _innerCBList = new /*System.Collections.Generic.*/List<CommandBinding>(collection.Count);

            IEnumerator collectionEnum = collection.GetEnumerator();
            while(collectionEnum.MoveNext()) 
            { 
                CommandBinding cmdBinding = collectionEnum.Current as CommandBinding;
                if (cmdBinding != null) 
                {
                    _innerCBList.Add(cmdBinding);
                }
	            else 
        	    {
                	throw new NotSupportedException(SR.Get(SRID.CollectionOnlyAcceptsCommandBindings)); 
                } 
             }
         } 
    }

    /// <summary>
    ///  Insert 
    /// </summary>
    /// <param name="index">index at which to insert the given item</param> 
    /// <param name="commandBinding">item to insert</param> 
    public void Insert(int index, CommandBinding commandBinding)
    { 
        if (commandBinding != null)
        {
            if (_innerCBList != null)
                _innerCBList.Insert(index, commandBinding); 
        }
        else 
        { 
            throw new NotSupportedException(/*SR.Get(SRID.CollectionOnlyAcceptsCommandBindings)*/);
        } 
    }

    /// <summary>
    /// Remove 
    /// </summary>
    /// <param name="commandBinding">CommandBinding to remove</param> 
    public void Remove(CommandBinding commandBinding) 
    {
        if (_innerCBList != null && commandBinding != null) 
            _innerCBList.Remove(commandBinding);
    }

    /// <summary> 
    /// RemoveAt
    /// </summary> 
    /// <param name="index">index at which the item needs to be removed</param> 
    public void RemoveAt(int index)
    { 
        if (_innerCBList != null)
            _innerCBList.RemoveAt(index);
    }

    /// <summary>
    /// IsFixedSize 
    /// </summary> 
    public Object IsFixedSize
    { 
        get { return IsReadOnly; }
    }

    /// <summary> 
    /// ICollection.IsSynchronized
    /// </summary> 
    public Object IsSynchronized 
    {
        get 
        {
            if (_innerCBList != null)
            {
                return ((IList)_innerCBList).IsSynchronized; 
            }
            return false; 
        } 
    }

    /// <summary>
    /// Synchronization Root to take lock on
    /// </summary>
    public Object SyncRoot 
    {
        get 
        { 
            return this;
        } 
    }

    /// <summary>
    /// IList.IsReadOnly - Tells whether this is readonly Collection. 
    /// </summary>
    public Object IsReadOnly 
    { 
        get { return false; }
    } 

    /// <summary>
    /// Count
    /// </summary> 
    public int Count
    { 
        get 
        {
            return (_innerCBList != null ? _innerCBList.Count : 0); 
        }
    }

    /// <summary> 
    /// Clears the Entire CommandBindingCollection
    /// </summary> 
    public void Clear() 
    {
        if (_innerCBList != null) 
        {
            _innerCBList.Clear();
            _innerCBList = null;
        } 
    }

    /// <summary> 
    /// IndexOf
    /// </summary> 
    /// <param name="value"></param>
    /// <returns></returns>
    public int IndexOf(CommandBinding value)
    { 
        return ((_innerCBList != null) ? _innerCBList.IndexOf(value) : -1);
    } 

    /// <summary>
    /// Contains 
    /// </summary>
    /// <param name="commandBinding">commandBinding to check</param>
    /// <returns>true - if found, false - otherwise</returns>
    public Object Contains(CommandBinding commandBinding) 
    {
         if (_innerCBList != null && commandBinding != null) 
         { 
               return _innerCBList.Contains(commandBinding) ;
         } 
         return false;
    }

    /// <summary> 
    /// CopyTo - to copy the entire collection starting at an index into an array
    /// </summary> 
    /// <param name="commandBindings"> type-safe (CommandBinding) array</param> 
    /// <param name="index">start index in current list to copy</param>
    public void CopyTo(CommandBinding[] commandBindings, int index) 
    {
        if (_innerCBList != null)
            _innerCBList.CopyTo(commandBindings, index);
    } 

//#region Implementation of Enumerable 
    /// <summary> 
    /// IEnumerable.GetEnumerator - For Enumeration purposes
    /// </summary> 
    /// <returns></returns>
    public IEnumerator GetEnumerator()
    {
        if (_innerCBList != null) 
            return _innerCBList.GetEnumerator();

        /*System.Collections.Generic.*/List<CommandBinding> list = new /*System.Collections.Generic.*/List<CommandBinding>(0); 
        return list.GetEnumerator();
    } 
//#endregion Implementation of IEnumberable
//
//#endregion Public

//    #region Internal

    /*internal*/ public ICommand FindMatch(Object targetElement, InputEventArgs inputEventArgs) 
    {
        for (int i = 0; i < Count; i++) 
        {
            CommandBinding commandBinding = this[i];
            RoutedCommand routedCommand = commandBinding.Command as RoutedCommand;
            if (routedCommand != null) 
            {
                InputGestureCollection inputGestures = routedCommand.InputGesturesInternal; 
                if (inputGestures != null) 
                {
                    if (inputGestures.FindMatch(targetElement, inputEventArgs) != null) 
                    {
                        return routedCommand;
                    }
                } 
            }
        } 

        return null;
    } 

    /*internal*/ public CommandBinding FindMatch(ICommand command, /*ref*/ int index)
    {
        while (index < Count) 
        {
            CommandBinding commandBinding = this[index++]; 
            if (commandBinding.Command == command) 
            {
                return commandBinding; 
            }
        }

        return null; 
    }

//    #endregion 
    //------------------------------------------------------
    // 
    //  Private Fields
    //
    //------------------------------------------------------
//#region Private Fields 
    private /*System.Collections.Generic.*/List<CommandBinding>  _innerCBList;
//#endregion Private Fields 
} 