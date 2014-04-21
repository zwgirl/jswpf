package org.summer.view.widget;

/// <summary>
/// ItemStructList
/// </summary>
/// <typeparam name="T"></typeparam>
//[System.Runtime.InteropServices.StructLayout(System.Runtime.InteropServices.LayoutKind.Sequential)]
public class ItemStructList<T>
{
    public T[] List;
    public int Count;
    /// <summary>
    /// Initializes a new instance of the <see cref="ItemStructList&lt;T&gt;"/> struct.
    /// </summary>
    /// <param name="capacity">The capacity.</param>
    public ItemStructList(int capacity)
    {
        List = new T[capacity];
        Count = 0;
    }

    /// <summary>
    /// Ensures the index.
    /// </summary>
    /// <param name="index">The index.</param>
    public void EnsureIndex(int index)
    {
        int delta = (index + 1) - Count;
        if (delta > 0)
        {
            Add(delta);
        }
    }

    /// <summary>
    /// Determines whether [is valid index] [the specified index].
    /// </summary>
    /// <param name="index">The index.</param>
    /// <returns>
    /// 	<c>true</c> if [is valid index] [the specified index]; otherwise, <c>false</c>.
    /// </returns>
    public boolean IsValidIndex(int index)
    {
        return ((index >= 0) && (index < Count));
    }

    /// <summary>
    /// Indexes the of.
    /// </summary>
    /// <param name="value">The value.</param>
    /// <returns></returns>
    public int IndexOf(T value)
    {
        for (int index = 0; index < Count; index++)
        {
            if (List[index].equals(value))
            {
                return index;
            }
        }
        return -1;
    }

    /// <summary>
    /// Determines whether [contains] [the specified value].
    /// </summary>
    /// <param name="value">The value.</param>
    /// <returns>
    /// 	<c>true</c> if [contains] [the specified value]; otherwise, <c>false</c>.
    /// </returns>
    public boolean Contains(T value)
    {
        return (IndexOf(value) != -1);
    }

    /// <summary>
    /// Adds the specified item.
    /// </summary>
    /// <param name="item">The item.</param>
    public void Add(T item)
    {
        int index = Add(1, false);
        List[index] = item;
        Count++;
    }
    /// <summary>
    /// Adds the specified item.
    /// </summary>
    /// <param name="item">The item.</param>
    public void Add(/*ref*/ T item)
    {
        int index = Add(1, false);
        List[index] = item;
        Count++;
    }
    /// <summary>
    /// Adds this instance.
    /// </summary>
    /// <returns></returns>
    public int Add()
    {
        return Add(1, true);
    }
    /// <summary>
    /// Adds the specified delta.
    /// </summary>
    /// <param name="delta">The delta.</param>
    /// <returns></returns>
    public int Add(int delta)
    {
        return Add(delta, true);
    }
    /// <summary>
    /// Adds the specified delta.
    /// </summary>
    /// <param name="delta">The delta.</param>
    /// <param name="incrCount">if set to <c>true</c> [incr count].</param>
    /// <returns></returns>
    private int Add(int delta, boolean incrementCount)
    {
        if (List != null)
        {
            if ((Count + delta) > List.length)
            {
                T[] array = new T[System.Math.Max((int)(List.Length * 2), (int)(Count + delta))];
                List.CopyTo(array, 0);
                List = array;
            }
        }
        else
        {
            List = new T[System.Math.Max(delta, 2)];
        }
        int count = Count;
        if (incrementCount == true)
        {
            Count += delta;
        }
        return count;
    }

    /// <summary>
    /// Sorts this instance.
    /// </summary>
    public void Sort()
    {
        if (List != null)
        {
            System.Array.Sort<T>(List, 0, Count);
        }
    }

    /// <summary>
    /// Appends to.
    /// </summary>
    /// <param name="destinationList">The destination list.</param>
    public void AppendTo(/*ref*/ ItemStructList<T> destinationList)
    {
        for (int index = 0; index < Count; index++)
        {
            destinationList.Add(ref List[index]);
        }
    }

    /// <summary>
    /// Toes the array.
    /// </summary>
    /// <returns></returns>
    public T[] ToArray()
    {
        T[] destinationArray = new T[Count];
        System.Array.Copy(List, 0, destinationArray, 0, Count);
        return destinationArray;
    }

    /// <summary>
    /// Clears this instance.
    /// </summary>
    public void Clear()
    {
        System.Array.Clear(List, 0, Count);
        Count = 0;
    }

    /// <summary>
    /// Removes the specified value.
    /// </summary>
    /// <param name="value">The value.</param>
    public void Remove(T value)
    {
        int index = IndexOf(value);
        if (index != -1)
        {
            System.Array.Copy(List, index + 1, List, index, (Count - index) - 1);
            System.Array.Clear(List, Count - 1, 1);
            Count--;
        }
    }
}
	
