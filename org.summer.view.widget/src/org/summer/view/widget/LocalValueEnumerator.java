package org.summer.view.widget;

import org.summer.view.widget.collection.IEnumerator;

/// <summary> 
///     Local value enumeration Object
/// </summary>
/// <remarks>
///     Modifying local values (via SetValue or ClearValue) during enumeration 
///     is unsupported
/// </remarks> 
public class LocalValueEnumerator implements IEnumerator 
{
    /// <summary> 
    /// Overrides Object.GetHashCode
    /// </summary>
    /// <returns>An integer that represents the hashcode for this Object</returns>
    public /*override*/ int GetHashCode() 
    {
        return super.GetHashCode(); 
    } 

    /// <summary> 
    ///     Determine equality
    /// </summary>
    public /*override*/ boolean Equals(Object obj)
    { 
        if(obj instanceof LocalValueEnumerator)
        { 
            LocalValueEnumerator other = (LocalValueEnumerator) obj; 

            return (_count == other._count && 
                    _index == other._index &&
                    _snapshot == other._snapshot);
        }
        else 
        {
            // being compared against something that isn't a LocalValueEnumerator. 
            return false; 
        }
    } 

    /// <summary>
    ///     Determine equality
    /// </summary> 
    public static boolean operator ==(LocalValueEnumerator obj1, LocalValueEnumerator obj2)
    { 
      return obj1.Equals(obj2); 
    }

    /// <summary>
    ///     Determine inequality
    /// </summary>
    public static boolean operator !=(LocalValueEnumerator obj1, LocalValueEnumerator obj2) 
    {
      return !(obj1 == obj2); 
    } 

    /// <summary> 
    ///     Get current entry
    /// </summary>
    public LocalValueEntry Current
    { 
        get
        { 
            if(_index == -1 ) 
            {
                #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
                throw new InvalidOperationException(SR.Get(SRID.LocalValueEnumerationReset));
            }

            if(_index >= Count ) 
            {
                #pragma warning suppress 6503 // IEnumerator.Current is documented to throw this exception 
                throw new InvalidOperationException(SR.Get(SRID.LocalValueEnumerationOutOfBounds)); 
            }

            return _snapshot[_index];
        }
    }

    /// <summary>
    ///     Get current entry (Object reference based) 
    /// </summary> 
    Object IEnumerator.Current
    { 
        get { return Current; }
    }

    /// <summary> 
    ///     Move to the next item in the enumerator
    /// </summary> 
    /// <returns>Success of the method</returns> 
    public boolean MoveNext()
    { 
        _index++;

        return _index < Count;
    } 

    /// <summary> 
    ///     Reset enumeration 
    /// </summary>
    public void Reset() 
    {
        _index = -1;
    }

    /// <summary>
    ///     Return number of items represented in the collection 
    /// </summary> 
    public int Count
    { 
        get { return _count; }
    }

    /*internal*/ LocalValueEnumerator(LocalValueEntry[] snapshot, int count) 
    {
        _index = -1; 
        _count = count; 
        _snapshot = snapshot;
    } 

    private int                     _index;
    private LocalValueEntry[]       _snapshot;
    private int                     _count; 
}