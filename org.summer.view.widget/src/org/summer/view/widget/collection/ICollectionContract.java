package org.summer.view.widget.collection;

//[ContractClassFor(typeof(ICollection))]
/*internal*/ class ICollectionContract implements ICollection
{
    void /*ICollection.*/CopyTo(Array array, int index)
    {
    }

    int /*ICollection.*/Count {
        get {
            Contract.Ensures(Contract.Result<int>() >= 0);
            return default(int);
        }
    }

    Object /*ICollection.*/SyncRoot {
        get {
            Contract.Ensures(Contract.Result<object>() != null);
            return default(Object);
        }
    }

    boolean /*ICollection.*/IsSynchronized {
        get { return default(boolean); }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        Contract.Ensures(Contract.Result<ienumerator>() != null);
        return default(IEnumerator);
    }
}