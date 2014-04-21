package org.summer.view.widget.controls;

import org.summer.view.widget.collection.IEnumerator;
 /*internal*/ public class HeaderedItemsModelTreeEnumerator extends ModelTreeEnumerator
    {
        /*internal*/ public HeaderedItemsModelTreeEnumerator(HeaderedItemsControl headeredItemsControl,
        		IEnumerator items, Object header) 
        {
        	super(header) ;
//            Debug.Assert(headeredItemsControl != null, "headeredItemsControl should be non-null."); 
//            Debug.Assert(items != null, "items should be non-null."); 
//            Debug.Assert(header != null, "header should be non-null. If Header was null, the base ItemsControl enumerator should have been used.");
 
            _owner = headeredItemsControl;
            _items = items;
        }
 
        protected /*override*/ Object Current
        { 
            get 
            {
                if (Index > 0) 
                {
                    return _items.Current;
                }
 
                return base.Current;
            } 
        } 

        protected /*override*/ boolean MoveNext() 
        {
            if (Index >= 0)
            {
                Index++; 
                return _items.MoveNext();
            } 
 
            return base.MoveNext();
        } 

        protected /*override*/ void Reset()
        {
            base.Reset(); 
            _items.Reset();
        } 
 
        protected /*override*/ boolean IsUnchanged
        { 
            get
            {
                Object header = Content;    // Header was passed to the base so that it would appear in index 0
                return Object.ReferenceEquals(header, _owner.Header); 
            }
        } 
 
        private HeaderedItemsControl _owner;
        private IEnumerator _items; 
    }