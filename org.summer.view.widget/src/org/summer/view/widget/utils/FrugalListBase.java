package org.summer.view.widget.utils;
 
public abstract class FrugalListBase<t>
{
    /// <summary>
    /// Number of entries in this store
    /// </summary>
    // Number of entries in this store
    public int Count
    {
        get
        {
            return _count;
        }
    }

    /// <summary>
    /// Capacity of this store
    /// </summary>
    public abstract int Capacity
    {
        get;
    }

    // Increase size if needed, insert item into the store
    public abstract FrugalListStoreState Add(T value);

    /// <summary>
    /// Removes all values from the store
    /// </summary>
    public abstract void Clear();

    /// <summary>
    /// Returns true if the store contains the entry.
    /// </summary>
    public abstract boolean Contains(T value);

    /// <summary>
    /// Returns the index into the store that contains the item.
    /// -1 is returned if the item is not in the store.
    /// </summary>
    public abstract int IndexOf(T value);

    /// <summary>
    /// Insert item into the store at index, grows if needed
    /// </summary>
    public abstract void Insert(int index, T value);

    // Place item into the store at index
    public abstract void SetAt(int index, T value);

    /// <summary>
    /// Removes the item from the store. If the item was not
    /// in the store false is returned.
    /// </summary>
    public abstract boolean Remove(T value);

    /// <summary>
    /// Removes the item from the store
    /// </summary>
    public abstract void RemoveAt(int index);

    /// <summary>
    /// Return the item at index in the store
    /// </summary>
    public abstract T EntryAt(int index);

    /// <summary>
    /// Promotes the values in the current store to the next larger
    /// and more complex storage model.
    /// </summary>
    public abstract void Promote(FrugalListBase<t> newList);

    /// <summary>
    /// Returns the entries as an array
    /// </summary>
    public abstract T[] ToArray();

    /// <summary>
    /// Copies the entries to the given array starting at the
    /// specified index
    /// </summary>
    public abstract void CopyTo(T[] array, int index);

    /// <summary>
    /// Creates a shallow copy of the  list
    /// </summary>
    public abstract Object Clone();

    // The number of items in the list.
    protected int _count;
}
  
