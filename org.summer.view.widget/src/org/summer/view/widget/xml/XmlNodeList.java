package org.summer.view.widget.xml;

import org.summer.view.widget.IDisposable;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;

// Represents an ordered collection of nodes.
    public abstract class XmlNodeList implements IEnumerable, IDisposable {

        // Retrieves a node at the given index. 
        public abstract XmlNode Item(int index);
 
        // Gets the number of nodes in this XmlNodeList. 
        public abstract int Count { get;}
 
        // Provides a simple ForEach-style iteration over the collection of nodes in
        // this XmlNodeList.
        public abstract IEnumerator GetEnumerator();
 
        // Retrieves a node at the given index.
//        [System.Runtime.CompilerServices.IndexerName ("ItemOf")] 
        public /*virtual*/ XmlNode this[int i] { get { return Item(i);}} 

        public void /*IDisposable.*/Dispose() 
        {
            PrivateDisposeNodeList();
        }
 
        protected /*virtual*/ void PrivateDisposeNodeList() { }
    }