package org.summer.view.widget.model;

import java.lang.reflect.Array;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.StringComparison;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.DictionaryEntry;
import org.summer.view.widget.collection.HybridDictionary;
import org.summer.view.widget.collection.ICollection;
import org.summer.view.widget.collection.IDictionary;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.IComparer;

/// <devdoc>
///    <para> 
///       Represents a collection of properties.
///    </para>
/// </devdoc>
//[System.Security.Permissions.HostProtection(Synchronization = true)] 
public class PropertyDescriptorCollection implements ICollection, IList, IDictionary {


    /// <devdoc>
    /// An empty PropertyDescriptorCollection that can used instead of creating a new one with no items. 
    /// </devdoc>
//    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2112:SecuredTypesShouldNotExposeFields")] // ReadOnly fields - already shipped.
    public static final PropertyDescriptorCollection Empty = new PropertyDescriptorCollection(null, true);

    private IDictionary          cachedFoundProperties;
    private boolean                 cachedIgnoreCase; 
    private PropertyDescriptor[] properties; 
    private int                  propCount = 0;
    private String[]             namedSort; 
    private IComparer            comparer;
    private boolean                 propsOwned = true;
    private boolean                 needSort = false;
    private boolean                 readOnly = false; 

    /// <devdoc> 
    ///    <para> 
    ///       Initializes a new instance of the <see cref='System.ComponentModel.PropertyDescriptorCollection'/>
    ///       class. 
    ///    </para>
    /// </devdoc>
    public PropertyDescriptorCollection(PropertyDescriptor[] properties) {
        this.properties = properties; 
        if (properties == null) {
            this.properties = new PropertyDescriptor[0]; 
            this.propCount = 0; 
        }
        else { 
            this.propCount = properties.length;
        }
        this.propsOwned = true;
    } 

    /// <devdoc> 
    ///     Initializes a new instance of a property descriptor collection, and allows you to mark the 
    ///     collection as read-only so it cannot be modified.
    /// </devdoc> 
    public PropertyDescriptorCollection(PropertyDescriptor[] properties, boolean readOnly)
    {
    	this(properties); 
        this.readOnly = readOnly;
    }

    private PropertyDescriptorCollection(PropertyDescriptor[] properties, int propCount, String[] namedSort, IComparer comparer) {
        this.propsOwned = false; 
        if (namedSort != null) { 
           this.namedSort = (String[])namedSort.Clone();
        } 
        this.comparer = comparer;
        this.properties = properties;
        this.propCount = propCount;
        this.needSort = true; 
    }

    /// <devdoc> 
    ///    <para>
    ///       Gets the number 
    ///       of property descriptors in the
    ///       collection.
    ///    </para>
    /// </devdoc> 
    public int Count {
        get { 
            return propCount; 
        }
    } 

    /// <devdoc>
    ///    <para>Gets the property with the specified index
    ///       number.</para> 
    /// </devdoc>
    public /*virtual*/ PropertyDescriptor this[int index] { 
        get { 
            if (index >= propCount) {
                throw new IndexOutOfRangeException(); 
            }
            EnsurePropsOwned();
            return properties[index];
        } 
    }

    /// <devdoc> 
    ///    <para>Gets the property with the specified name.</para>
    /// </devdoc> 
    public /*virtual*/ PropertyDescriptor this[String name] {
        get {
            return Find(name, false);
        } 
    }

    /// <devdoc> 
    ///    <para>[To be supplied.]</para>
    /// </devdoc> 
    public int Add(PropertyDescriptor value) {
        if (readOnly) {
            throw new NotSupportedException();
        } 

        EnsureSize(propCount + 1); 
        properties[propCount++] = value; 
        return propCount - 1;
    } 

    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc> 
    public void Clear() {
        if (readOnly) { 
            throw new NotSupportedException(); 
        }

        propCount = 0;
        cachedFoundProperties = null;
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para> 
    /// </devdoc> 
    public boolean Contains(PropertyDescriptor value) {
        return IndexOf(value) >= 0; 
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para> 
    /// </devdoc>
    public void CopyTo(Array array, int index) { 
        EnsurePropsOwned(); 
        Array.Copy(properties, 0, array, index, Count);
    } 

    private void EnsurePropsOwned() {
        if (!propsOwned) {
           propsOwned = true; 
           if (properties != null) {
              PropertyDescriptor[] newProps = new PropertyDescriptor[Count]; 
              Array.Copy(properties, 0, newProps, 0, Count); 
              this.properties = newProps;
           } 
        }

        if (needSort) {
           needSort = false; 
           InternalSort(this.namedSort);
        } 
    } 

    private void EnsureSize(int sizeNeeded) { 

        if (sizeNeeded <= properties.length) {
           return;
        } 

        if (properties == null || properties.length == 0) { 
            propCount = 0; 
            properties = new PropertyDescriptor[sizeNeeded];
            return; 
        }

        EnsurePropsOwned();

        int newSize = Math.Max(sizeNeeded, properties.length * 2);
        PropertyDescriptor[] newProps = new PropertyDescriptor[newSize]; 
        Array.Copy(properties, 0, newProps, 0, propCount); 
        properties = newProps;
    } 

    /// <devdoc>
    ///    <para>Gets the description of the property with the specified
    ///       name.</para> 
    /// </devdoc>
    public /*virtual*/ PropertyDescriptor Find(String name, boolean ignoreCase) { 
        lock(this) { 
            PropertyDescriptor p = null;

            if (cachedFoundProperties == null || cachedIgnoreCase != ignoreCase) {
                cachedIgnoreCase = ignoreCase;
                cachedFoundProperties = new HybridDictionary(ignoreCase);
            } 

            // first try to find it in the cache 
            // 
            Object cached = cachedFoundProperties[name];

            if (cached != null) {
                return (PropertyDescriptor) cached;
            }

            // Now start walking from where we last left off, filling
            // the cache as we go. 
            // 
            for(int i = 0; i < propCount; i++) {

                if (ignoreCase) {
                    if (String.Equals(properties[i].Name, name, StringComparison.OrdinalIgnoreCase)) {
                        cachedFoundProperties[name] = properties[i];
                        p = properties[i]; 
                        break;
                    } 
                } 
                else {
                    if (properties[i].Name.Equals(name)) { 
                        cachedFoundProperties[name] = properties[i];
                        p = properties[i];
                        break;
                    } 
                }
            } 

            return p;
        } 
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para> 
    /// </devdoc>
    public int IndexOf(PropertyDescriptor value) { 
        return Array.IndexOf(properties, value, 0, propCount); 
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    public void Insert(int index, PropertyDescriptor value) { 
        if (readOnly) {
            throw new NotSupportedException(); 
        } 

        EnsureSize(propCount + 1); 
        if (index < propCount) {
            Array.Copy(properties, index, properties, index + 1, propCount - index);
        }
        properties[index] = value; 
        propCount++;
    } 

    /// <devdoc>
    ///    <para>[To be supplied.]</para> 
    /// </devdoc>
    public void Remove(PropertyDescriptor value) {
        if (readOnly) {
            throw new NotSupportedException(); 
        }

        int index = IndexOf(value); 

        if (index != -1) { 
            RemoveAt(index);
        }
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para> 
    /// </devdoc> 
    public void RemoveAt(int index) {
        if (readOnly) { 
            throw new NotSupportedException();
        }

        if (index < propCount - 1) { 
            Array.Copy(properties, index + 1, properties, index, propCount - index - 1);
        } 
        properties[propCount - 1] = null; 
        propCount--;
    } 

    /// <devdoc>
    ///    <para>
    ///       Sorts the members of this PropertyDescriptorCollection, using the default sort for this collection, 
    ///       which is usually alphabetical.
    ///    </para> 
    /// </devdoc> 
    public /*virtual*/ PropertyDescriptorCollection Sort() {
        return new PropertyDescriptorCollection(this.properties, this.propCount, this.namedSort, this.comparer); 
    }


    /// <devdoc> 
    ///    <para>
    ///       Sorts the members of this PropertyDescriptorCollection.  Any specified NamedSort arguments will 
    ///       be applied first, followed by sort using the specified IComparer. 
    ///    </para>
    /// </devdoc> 
    public /*virtual*/ PropertyDescriptorCollection Sort(String[] names) {
        return new PropertyDescriptorCollection(this.properties, this.propCount, names, this.comparer);
    }

    /// <devdoc>
    ///    <para> 
    ///       Sorts the members of this PropertyDescriptorCollection.  Any specified NamedSort arguments will 
    ///       be applied first, followed by sort using the specified IComparer.
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ PropertyDescriptorCollection Sort(String[] names, IComparer comparer) {
        return new PropertyDescriptorCollection(this.properties, this.propCount, names, comparer);
    } 

     /// <devdoc> 
    ///    <para> 
    ///       Sorts the members of this PropertyDescriptorCollection, using the specified IComparer to compare,
    ///       the PropertyDescriptors contained in the collection. 
    ///    </para>
    /// </devdoc>
    public /*virtual*/ PropertyDescriptorCollection Sort(IComparer comparer) {
        return new PropertyDescriptorCollection(this.properties, this.propCount, this.namedSort, comparer); 
    }

    /// <devdoc> 
    ///    <para>
    ///       Sorts the members of this PropertyDescriptorCollection.  Any specified NamedSort arguments will 
    ///       be applied first, followed by sort using the specified IComparer.
    ///    </para>
    /// </devdoc>
    protected void InternalSort(String[] names) { 
        if (properties == null || properties.length == 0) {
            return; 
        } 

        this.InternalSort(this.comparer); 

        if (names != null && names.length > 0) {

           ArrayList propArrayList = new ArrayList(properties); 
           int foundCount = 0;
           int propCount = properties.length; 

           for (int i = 0; i < names.length; i++) {
                for (int j = 0; j < propCount; j++) { 
                    PropertyDescriptor currentProp = (PropertyDescriptor)propArrayList[j];

                    // Found a matching property.  Here, we add it to our array.  We also
                    // mark it as null in our array list so we don't add it twice later. 
                    //
                    if (currentProp != null && currentProp.Name.Equals(names[i])) { 
                        properties[foundCount++] = currentProp; 
                        propArrayList[j] = null;
                        break; 
                    }
                }
           }

           // At this point we have filled in the first "foundCount" number of propeties, one for each
           // name in our name array.  If a name didn't match, then it is ignored.  Next, we must fill 
           // in the rest of the properties.  We now have a sparse array containing the remainder, so 
           // it's easy.
           // 
           for (int i = 0; i < propCount; i++) {
               if (propArrayList[i] != null) {
                   properties[foundCount++] = (PropertyDescriptor)propArrayList[i];
               } 
           }

           Debug.Assert(foundCount == propCount, "We did not completely fill our property array"); 
        }
    } 

    /// <devdoc>
    ///    <para>
    ///       Sorts the members of this PropertyDescriptorCollection using the specified IComparer. 
    ///    </para>
    /// </devdoc> 
    protected void InternalSort(IComparer sorter) { 
        if (sorter == null) {
            TypeDescriptor.SortDescriptorArray(this); 
        }
        else {
            Array.Sort(properties, sorter);
        } 
    }

    /// <devdoc> 
    ///    <para>
    ///       Gets an enumerator for this <see cref='System.ComponentModel.PropertyDescriptorCollection'/>. 
    ///    </para>
    /// </devdoc>
    public /*virtual*/ IEnumerator GetEnumerator() {
        EnsurePropsOwned(); 
        // we can only return an enumerator on the props we actually have...
        if (properties.length != this.propCount) { 
            PropertyDescriptor[] enumProps = new PropertyDescriptor[propCount]; 
            Array.Copy(properties, 0, enumProps, 0, propCount);
            return enumProps.GetEnumerator(); 
        }
        return properties.GetEnumerator();
    }

    /// <internalonly/>
    int ICollection.Count { 
        get { 
            return Count;
        } 
    }

    /// <internalonly/>
    boolean ICollection.IsSynchronized { 
        get {
            return false; 
        } 
    }

    /// <internalonly/>
    Object ICollection.SyncRoot {
        get {
            return null; 
        }
    } 

    /// <internalonly/>
    void IDictionary.Add(Object key, Object value) { 
        PropertyDescriptor newProp = value as PropertyDescriptor;

        if (newProp == null) {
            throw new ArgumentException("value"); 
        }
        Add(newProp); 
    } 

    /// <internalonly/> 
    void IDictionary.Clear() {
        Clear();
    }

    /// <internalonly/>
    boolean IDictionary.Contains(Object key) { 
        if (key is String) { 
            return this[(String)key] != null;
        } 
        return false;
    }

    /// <internalonly/> 
    IDictionaryEnumerator IDictionary.GetEnumerator() {
        return new PropertyDescriptorEnumerator(this); 
    } 

     /// <internalonly/> 
     boolean IDictionary.IsFixedSize {
        get {
            return readOnly;
        } 
    }

    /// <internalonly/> 
    boolean IDictionary.IsReadOnly {
        get { 
            return readOnly;
        }
    }

    /// <internalonly/>
    Object IDictionary.this[Object key] { 
        get { 
            if (key is String) {
                return this[(String)key]; 
            }
            return null;
        }

        set {
            if (readOnly) { 
                throw new NotSupportedException(); 
            }

            if (value != null && !(value is PropertyDescriptor)) {
                throw new ArgumentException("value");
            }

            int index = -1;

            if (key is int) { 
                index = (int)key;

                if (index < 0 || index >= propCount) {
                    throw new IndexOutOfRangeException();
                }
            } 
            else if (key is String) {
                for (int i = 0; i < propCount; i++) { 
                    if (properties[i].Name.Equals((String)key)) { 
                        index = i;
                        break; 
                    }
                }
            }
            else { 
                throw new ArgumentException("key");
            } 

            if (index == -1) {
                Add((PropertyDescriptor)value); 
            }
            else {
                EnsurePropsOwned();
                properties[index] = (PropertyDescriptor)value; 
                if (cachedFoundProperties != null && key is String) {
                    cachedFoundProperties[key] = value; 
                } 
            }
        } 
    }

    /// <internalonly/>
    ICollection IDictionary.Keys { 
        get {
            String[] keys = new String[propCount]; 
            for (int i = 0; i < propCount ;i++) { 
                keys[i] = properties[i].Name;
            } 
            return keys;
        }
    }

    /// <internalonly/>
    ICollection IDictionary.Values { 
        get { 
            // we can only return an enumerator on the props we actually have...
            // 
            if (properties.length != this.propCount) {
                PropertyDescriptor[] newProps = new PropertyDescriptor[propCount];
                Array.Copy(properties, 0, newProps, 0, propCount);
                return newProps; 
            }
            else { 
                return (ICollection)properties.Clone(); 
            }
        } 
    }

    /// <internalonly/>
    void IDictionary.Remove(Object key) { 
        if (key is String) {
            PropertyDescriptor pd = this[(String)key]; 
            if (pd != null) { 
                ((IList)this).Remove(pd);
            } 
        }
    }

    /// <internalonly/> 
    IEnumerator IEnumerable.GetEnumerator() {
        return GetEnumerator(); 
    } 

    /// <internalonly/> 
    int IList.Add(Object value) {
        return Add((PropertyDescriptor)value);
    }

    /// <internalonly/>
    void IList.Clear() { 
        Clear(); 
    }

    /// <internalonly/>
    boolean IList.Contains(Object value) {
        return Contains((PropertyDescriptor)value);
    } 

    /// <internalonly/> 
    int IList.IndexOf(Object value) { 
        return IndexOf((PropertyDescriptor)value);
    } 

    /// <internalonly/>
    void IList.Insert(int index, Object value) {
        Insert(index, (PropertyDescriptor)value); 
    }

    /// <internalonly/> 
    boolean IList.IsReadOnly {
        get { 
            return readOnly;
        }
    }

    /// <internalonly/>
    boolean IList.IsFixedSize { 
        get { 
            return readOnly;
        } 
    }

    /// <internalonly/>
    void IList.Remove(Object value) { 
        Remove((PropertyDescriptor)value);
    } 

    /// <internalonly/>
    void IList.RemoveAt(int index) { 
        RemoveAt(index);
    }

    /// <internalonly/> 
    Object IList.this[int index] {
        get { 
            return this[index]; 
        }
        set { 
            if (readOnly) {
                throw new NotSupportedException();
            }

            if (index >= propCount) {
                throw new IndexOutOfRangeException(); 
            } 


            if (value != null && !(value is PropertyDescriptor)) {
                throw new ArgumentException("value");
            }

            EnsurePropsOwned();
            properties[index] = (PropertyDescriptor)value; 
        } 
    }

    private class PropertyDescriptorEnumerator implements IDictionaryEnumerator {
        private PropertyDescriptorCollection owner;
        private int index = -1;

        public PropertyDescriptorEnumerator(PropertyDescriptorCollection owner) {
            this.owner = owner; 
        } 

        public Object Current { 
            get{
                return Entry;
            }
        } 

        public DictionaryEntry Entry { 
            get { 
                PropertyDescriptor curProp = owner[index];
                return new DictionaryEntry(curProp.Name, curProp); 
            }
        }

        public Object Key { 
            get {
                return owner[index].Name; 
            } 
        }

        public Object Value {
            get {
                return owner[index].Name;
            } 
        }

        public boolean MoveNext() { 
            if (index < (owner.Count - 1)) {
                index++; 
                return true;
            }
            return false;
        } 

        public void Reset() { 
            index = -1; 
        }
    } 
}