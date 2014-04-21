/**
 * SortDescriptionCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection", "specialized/INotifyCollectionChanged"], 
		function(declare, Type, Collection, INotifyCollectionChanged){
	var SortDescriptionCollection = declare("SortDescriptionCollection", [Collection, INotifyCollectionChanged],{
		constructor:function(){

		},
		
	      /// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners
        /// </summary>
//        protected override void 
        ClearItems:function() 
        {
        	Collection.prototype.ClearItems.call(this); 
            this.OnCollectionChanged(NotifyCollectionChangedAction.Reset); 
        },
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
//        protected override void 
        RemoveItem:function(/*int*/ index)
        { 
            /*SortDescription*/var removedItem = this.Get(index); //[index]; 
            Collection.prototype.RemoveItem.call(this, index);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, index); 
        },

        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is added to list; 
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
//        protected override void 
        InsertItem:function(/*int*/ index, /*SortDescription*/ item) 
        {
            item.Seal(); 
            Collection.prototype.InsertItem.call(this, index, item);
            this.OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index);
        },
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is set in the list; 
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*SortDescription*/ item) 
        {
            item.Seal();
            /*SortDescription*/var originalItem = this.Get(index); //[index];
            Collection.prototype.SetItem.call(this, index, item); 
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, originalItem, index);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index); 
        }, 

        /// <summary> 
        /// raise CollectionChanged event to any listeners
        /// </summary>
//        private void 
        OnCollectionChanged:function(/*NotifyCollectionChangedAction*/ action, /*object*/ item, /*int*/ index)
        { 
        	var args = null;
        	if(arguments.length == 1){
        		args = new NotifyCollectionChangedEventArgs(action);
        	}else if(arguments.length === 3){
        		args = new NotifyCollectionChangedEventArgs(action, item, index);
        	}
        	
            if (this.CollectionChanged != null)
            { 
                this.CollectionChanged.Invoke(this, args); 
            }
        },
//        // raise CollectionChanged event to any listeners
//        void OnCollectionChanged(NotifyCollectionChangedAction action)
//        {
//            if (this.CollectionChanged != null) 
//            {
//                this.CollectionChanged(this, new NotifyCollectionChangedEventArgs(action)); 
//            } 
//        }
	});
	
	Object.defineProperties(SortDescriptionCollection.prototype,{
//        protected event NotifyCollectionChangedEventHandler 
        CollectionChanged:
        {
        	get:function(){
        		if(this._CollectionChanged === undefined){
        			this._CollectionChanged = new Delegate();
        		}
        		
        		return this._CollectionChanged;
        	}
        }

	});
	
	var EmptySortDescriptionCollection = declare([SortDescriptionCollection, IList], {
		/// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        ClearItems:function()
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        RemoveItem:function(/*int*/ index)
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is added to list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*SortDescription*/ item)
        {
            throw new NotSupportedException(); 
        },

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when an item is set in list;
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*SortDescription*/ item)
        {
            throw new NotSupportedException(); 
        }
	});
	
	Object.defineProperties(EmptySortDescriptionCollection.prototype,{
//      protected event NotifyCollectionChangedEventHandler 
      CollectionChanged:
      {

//          bool IList.
          IsFixedSize: 
          {
                get:function() { return true; } 
          },

//          bool IList.
          IsReadOnly: 
          {
                get:function() { return true; }
          }
      }

	});
	
	EmptySortDescriptionCollection.Type =new Type("EmptySortDescriptionCollection", EmptySortDescriptionCollection, []);
	
	
	Object.defineProperties(SortDescriptionCollection,{
		/// <summary>
        /// returns an empty and non-modifiable SortDescriptionCollection 
        /// </summary>
//        public static readonly SortDescriptionCollection 
        Empty:
        {
        	get:function(){
        		if(SortDescriptionCollection._Empty===undefined){
        			SortDescriptionCollection._Empty = new EmptySortDescriptionCollection();
        		}
        		return SortDescriptionCollection._Empty;
        	}
        }

	});
	
	SortDescriptionCollection.Type = new Type("SortDescriptionCollection",
			SortDescriptionCollection, [Collection.Type, INotifyCollectionChanged.Type]);
	return SortDescriptionCollection;
});

//---------------------------------------------------------------------------- 
//
// <copyright file="SortDescriptionCollection.cs" company="Microsoft">
//    Copyright (C) 2003 by Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// 
// Description: dynamic collection of SortDescriptions 
//
// See spec at http://avalon/connecteddata/Specs/CollectionView.mht 
//
// History:
//  03/24/2005 : [....]   - created
// 
//---------------------------------------------------------------------------
using System; 
using System.Collections; 
using System.Collections.ObjectModel;
using System.Collections.Specialized; 
using System.Windows;

using MS.Utility;
 
namespace System.ComponentModel
{ 
    /// <summary> 
    /// Implementation of a dynamic data collection of SortDescriptions.
    /// </summary> 
    public class SortDescriptionCollection : Collection<SortDescription>, INotifyCollectionChanged
    {
        //-----------------------------------------------------
        // 
        //  Public Events
        // 
        //----------------------------------------------------- 

        #region Public Events 

        /// <summary>
        /// Occurs when the collection changes, either by adding or removing an item.
        /// </summary> 
        /// <remarks>
        /// see <seealso cref="INotifyCollectionChanged"/> 
        /// </remarks> 
        event NotifyCollectionChangedEventHandler INotifyCollectionChanged.CollectionChanged
        { 
            add
            {
                CollectionChanged += value;
            } 
            remove
            { 
                CollectionChanged -= value; 
            }
        } 

        /// <summary>
        /// Occurs when the collection changes, either by adding or removing an item.
        /// </summary> 
        protected event NotifyCollectionChangedEventHandler CollectionChanged;
 
        #endregion Public Events 

 
        //------------------------------------------------------
        //
        //  Protected Methods
        // 
        //-----------------------------------------------------
 
        #region Protected Methods 

        /// <summary> 
        /// called by base class Collection&lt;T&gt; when the list is being cleared;
        /// raises a CollectionChanged event to any listeners
        /// </summary>
        protected override void ClearItems() 
        {
            base.ClearItems(); 
            OnCollectionChanged(NotifyCollectionChangedAction.Reset); 
        }
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is removed from list;
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
        protected override void RemoveItem(int index)
        { 
            SortDescription removedItem = this[index]; 
            base.RemoveItem(index);
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, removedItem, index); 
        }

        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is added to list; 
        /// raises a CollectionChanged event to any listeners
        /// </summary> 
        protected override void InsertItem(int index, SortDescription item) 
        {
            item.Seal(); 
            base.InsertItem(index, item);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index);
        }
 
        /// <summary>
        /// called by base class Collection&lt;T&gt; when an item is set in the list; 
        /// raises a CollectionChanged event to any listeners 
        /// </summary>
        protected override void SetItem(int index, SortDescription item) 
        {
            item.Seal();
            SortDescription originalItem = this[index];
            base.SetItem(index, item); 
            OnCollectionChanged(NotifyCollectionChangedAction.Remove, originalItem, index);
            OnCollectionChanged(NotifyCollectionChangedAction.Add, item, index); 
        } 

        /// <summary> 
        /// raise CollectionChanged event to any listeners
        /// </summary>
        private void OnCollectionChanged(NotifyCollectionChangedAction action, object item, int index)
        { 
            if (CollectionChanged != null)
            { 
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action, item, index)); 
            }
        } 
        // raise CollectionChanged event to any listeners
        void OnCollectionChanged(NotifyCollectionChangedAction action)
        {
            if (CollectionChanged != null) 
            {
                CollectionChanged(this, new NotifyCollectionChangedEventArgs(action)); 
            } 
        }
        #endregion Protected Methods 


        /// <summary>
        /// Immutable, read-only SortDescriptionCollection 
        /// </summary>
        class EmptySortDescriptionCollection : SortDescriptionCollection, IList 
        { 
            //------------------------------------------------------
            // 
            //  Protected Methods
            //
            //------------------------------------------------------
 
            #region Protected Methods
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when the list is being cleared;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected override void ClearItems()
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is removed from list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected override void RemoveItem(int index)
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is added to list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected override void InsertItem(int index, SortDescription item)
            {
                throw new NotSupportedException(); 
            }
 
            /// <summary> 
            /// called by base class Collection&lt;T&gt; when an item is set in list;
            /// raises a CollectionChanged event to any listeners 
            /// </summary>
            protected override void SetItem(int index, SortDescription item)
            {
                throw new NotSupportedException(); 
            }
 
            #endregion Protected Methods 

            #region IList Implementations 

            // explicit implementation to override the IsReadOnly and IsFixedSize properties

            bool IList.IsFixedSize 
            {
                  get { return true; } 
            } 

            bool IList.IsReadOnly 
            {
                  get { return true; }
            }
            #endregion IList Implementations 

        } 
 
        /// <summary>
        /// returns an empty and non-modifiable SortDescriptionCollection 
        /// </summary>
        public static readonly SortDescriptionCollection Empty = new EmptySortDescriptionCollection();

    } 
}
 
 
        

 