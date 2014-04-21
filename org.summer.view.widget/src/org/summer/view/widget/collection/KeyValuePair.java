package org.summer.view.widget.collection;
//A KeyValuePair holds a key and a value from a dictionary.
// It is used by the IEnumerable<T> implementation for both IDictionary<TKey, TValue> 
// and IReadOnlyDictionary<TKey, TValue>.
//[Serializable] 
public class KeyValuePair<TKey, TValue> { 
    private TKey key;
    private TValue value; 

    public KeyValuePair(TKey key, TValue value) {
        this.key = key;
        this.value = value; 
    }

    public TKey Key { 
        get { return key; }
    } 

    public TValue Value {
        get { return value; }
    } 

    public /*override*/ String ToString() { 
        StringBuilder s = StringBuilderCache.Acquire(); 
        s.Append('[');
        if( Key != null) { 
            s.Append(Key.ToString());
        }
        s.Append(", ");
        if( Value != null) { 
           s.Append(Value.ToString());
        } 
        s.Append(']'); 
        return StringBuilderCache.GetStringAndRelease(s);
    } 
}


