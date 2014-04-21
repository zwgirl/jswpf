package org.summer.view.widget;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.internal.InheritanceContextHelper;

/// <summary> 
///   A set of TriggerAction for use in a Trigger Object
/// </summary>
public /*sealed*/ class TriggerActionCollection implements IList, IList<TriggerAction>
{ 
    ///////////////////////////////////////////////////////////////////////
    //  Public members 

    /// <summary>
    ///     Creates a TriggerActionCollection 
    /// </summary>
    public TriggerActionCollection()
    {
        _rawList = new List<TriggerAction>(); 
    }

    /// <summary> 
    ///     Creates a TriggerActionCollection starting at the given size
    /// </summary> 
    public TriggerActionCollection(int initialSize)
    {
        _rawList = new List<TriggerAction>(initialSize);
    } 

    /////////////////////////////////////////////////////////////////////// 
    // Public non-type-specific properties and methods that satisfy 
    //  implementation requirements of both IList and IList<T>

    /// <summary>
    ///     ICollection.Count
    /// </summary>
    public int Count 
    {
        get 
        { 
            return _rawList.Count;
        } 
    }

    /// <summary>
    ///     IList.IsReadOnly 
    /// </summary>
    public boolean IsReadOnly 
    { 
        get
        { 
            return _sealed;
        }
    }

    /// <summary>
    ///     IList.Clear 
    /// </summary> 
    public void Clear()
    { 
        CheckSealed();

        for (int i = _rawList.Count - 1; i >= 0; i--)
        { 
            InheritanceContextHelper.RemoveContextFromObject(_owner, _rawList[i]);
        } 

        _rawList.Clear();
    } 

    /// <summary>
    ///     IList.RemoveAt
    /// </summary> 
    public void RemoveAt(int index)
    { 
        CheckSealed(); 
        TriggerAction oldValue = _rawList[index];
        InheritanceContextHelper.RemoveContextFromObject(_owner, oldValue); 
        _rawList.RemoveAt(index);

    }

    ///////////////////////////////////////////////////////////////////////
    //  Strongly-typed implementations 

    /// <summary>
    ///     IList.Add 
    /// </summary>

    public void Add(TriggerAction value)
    { 
        CheckSealed();
        InheritanceContextHelper.ProvideContextForObject( _owner, value ); 
        _rawList.Add(value); 
    }


    /// <summary>
    ///     IList.Contains
    /// </summary> 
    public boolean Contains(TriggerAction value)
    { 
        return _rawList.Contains(value); 
    }

    /// <summary>
    ///     ICollection.CopyTo
    /// </summary>
    public void CopyTo( TriggerAction[] array, int index ) 
    {
        _rawList.CopyTo(array, index); 
    } 

    /// <summary> 
    ///     IList.IndexOf
    /// </summary>
    public int IndexOf(TriggerAction value)
    { 
        return _rawList.IndexOf(value);
    } 

    /// <summary>
    ///     IList.Insert 
    /// </summary>
    public void Insert(int index, TriggerAction value)
    {
        CheckSealed(); 
        InheritanceContextHelper.ProvideContextForObject(_owner, value );
        _rawList.Insert(index, value); 

    }

    /// <summary>
    ///     IList.Remove
    /// </summary>
    public boolean Remove(TriggerAction value) 
    {
        CheckSealed(); 
        InheritanceContextHelper.RemoveContextFromObject(_owner, value); 
        boolean wasRemoved = _rawList.Remove(value);
        return wasRemoved; 
    }

    /// <summary>
    ///     IList.Item 
    /// </summary>
    public TriggerAction this[int index] 
    { 
        get
        { 
            return _rawList[index];
        }
        set
        { 
            CheckSealed();

            Object oldValue = _rawList[index]; 
            InheritanceContextHelper.RemoveContextFromObject(Owner, oldValue as DependencyObject);
            _rawList[index] = value; 
        }
    }

    /// <summary> 
    ///     IEnumerable.GetEnumerator
    /// </summary> 
    [CLSCompliant(false)] 
    public IEnumerator<TriggerAction> GetEnumerator()
    { 
        return _rawList.GetEnumerator();
    }

    /////////////////////////////////////////////////////////////////////// 
    //  Object-based implementations that can be removed once Parser
    //      has IList<T> support for strong typing. 

    int IList.Add(Object value)
    { 
        CheckSealed();
        InheritanceContextHelper.ProvideContextForObject(_owner, value as DependencyObject);
        int index = ((IList) _rawList).Add(VerifyIsTriggerAction(value));
        return index; 
    }

    boolean IList.Contains(Object value) 
    {
        return _rawList.Contains(VerifyIsTriggerAction(value)); 
    }

    int IList.IndexOf(Object value)
    { 
        return _rawList.IndexOf(VerifyIsTriggerAction(value));
    } 

    void IList.Insert(int index, Object value)
    { 
        Insert(index, VerifyIsTriggerAction(value));
    }

    boolean IList.IsFixedSize 
    {
        get 
        { 
            return _sealed;
        } 
    }

    void IList.Remove(Object value)
    { 
        Remove(VerifyIsTriggerAction(value));
    } 

    Object IList.this[int index]
    { 
        get
        {
            return _rawList[index];
        } 
        set
        { 
            this[index] = VerifyIsTriggerAction(value); 
        }
    } 

    void ICollection.CopyTo(Array array, int index)
    {
        ((ICollection)_rawList).CopyTo(array, index); 
    }

    Object ICollection.SyncRoot 
    {
        get 
        {
            return this;
        }
    } 

    boolean ICollection.IsSynchronized 
    { 
        get
        { 
            return false;
        }
    }

    IEnumerator IEnumerable.GetEnumerator()
    { 
        return ((IEnumerable)_rawList).GetEnumerator(); 
    }

    ///////////////////////////////////////////////////////////////////////
    //  Internal members

    internal void Seal(TriggerBase containingTrigger ) 
    {
        for( int i = 0; i < _rawList.Count; i++ ) 
        { 
            _rawList[i].Seal(containingTrigger);
        } 
    }

    // The event trigger that we're in

    internal DependencyObject Owner
    { 
        get { return _owner; } 
        set
        { 
            Debug.Assert (Owner == null);
            _owner = value;
        }
    } 

    /////////////////////////////////////////////////////////////////////// 
    //  Private members 

    // Throw if a change is attempted at a time we're not allowing them 
    private void CheckSealed()
    {
        if ( _sealed )
        { 
            throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "TriggerActionCollection"));
        } 
    } 

    // Throw if the given Object isn't a TriggerAction 
    private TriggerAction VerifyIsTriggerAction(Object value)
    {
        TriggerAction action = value as TriggerAction;

        if( action == null )
        { 
            if( value == null ) 
            {
                throw new ArgumentNullException("value"); 
            }
            else
            {
                throw new ArgumentException(SR.Get(SRID.MustBeTriggerAction)); 
            }
        } 

        return action;
    } 



    // The actual underlying storage for our TriggerActions 
    private List<TriggerAction> _rawList;

    // Whether we are allowing further changes to the collection 
    private boolean _sealed = false;

    // The event trigger that we're in
    private DependencyObject _owner = null;

} 