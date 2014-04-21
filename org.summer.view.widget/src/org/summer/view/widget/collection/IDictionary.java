package org.summer.view.widget.collection;


// An IDictionary is a possibly unordered set of key-value pairs.
// Keys can be any non-null object.  Values can be any object.
// You can look up a value in an IDictionary via the default indexed
// property, Items.
//[ContractClass(typeof(IDictionaryContract<,>))]
public interface IDictionary<tkey, tvalue/*=""*/> extends ICollection<KeyValuePair<tkey, tvalue/*=""*/>>
{
    // Interfaces are not serializable
    // The Item property provides methods to read and edit entries
    // in the Dictionary.
    TValue this[TKey key] {
        get;
        set;
    }

    // Returns a collections of the keys in this dictionary.
    ICollection<tkey> Keys {
        get;
    }

    // Returns a collections of the values in this dictionary.
    ICollection<tvalue> Values {
        get;
    }

    // Returns whether this dictionary contains a particular key.
    //
    boolean ContainsKey(TKey key);

    // Adds a key-value pair to the dictionary.
    //
    void Add(TKey key, TValue value);

    // Removes a particular key from the dictionary.
    //
    boolean Remove(TKey key);

    boolean TryGetValue(TKey key, out TValue value);
}


