/**
 * SetterBaseCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection"], 
		function(declare, Type, Collection){
	var SetterBaseCollection = declare("SetterBaseCollection", Collection,{
		constructor:function(){
			Collection.prototype.constructor.call(this);
			
			this._sealed = false;
		},
		

        /// <summary> 
        ///     ClearItems override
        /// </summary>
//        protected override void 
        ClearItems:function()
        { 
        	this.CheckSealed();
            Collection.prototype.ClearItems.call(this); 
        }, 

        /// <summary> 
        ///     InsertItem override
        /// </summary>
//        protected override void 
        InsertItem:function(/*int*/ index, /*SetterBase*/ item)
        { 
            this.CheckSealed();
            this.SetterBaseValidation(item); 
            Collection.prototype.InsertItem.call(this, index, item); 
        },
 
        /// <summary>
        ///     RemoveItem override
        /// </summary>
//        protected override void 
        RemoveItem:function(/*int*/ index) 
        {
        	this.CheckSealed(); 
        	Collection.prototype.RemoveItem.call(this, index); 
        },
 
        /// <summary>
        ///     SetItem override
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*SetterBase*/ item) 
        {
        	this.CheckSealed(); 
        	this.SetterBaseValidation(item); 
        	Collection.prototype.SetItem.call(this, index, item);
        },
        

//        internal void 
        Seal:function() 
        {
            this._sealed = true; 
 
            // Seal all the setters
            for (var i=0; i<this.Count; i++) 
            {
                this.Get(i).Seal();
            }
        },
 
//        private void 
        CheckSealed:function()
        {
            if (this._sealed)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SetterBaseCollection")');
            } 
        }, 

//        private void 
        SetterBaseValidation:function(/*SetterBase*/ setterBase) 
        {
            if (setterBase == null)
            {
                throw new Error('ArgumentNullException("setterBase")'); 
            }
        } 
 
	});
	
	Object.defineProperties(SetterBaseCollection.prototype,{

        /// <summary> 
        ///     Returns the sealed state of this object.  If true, any attempt 
        ///     at modifying the state of this object will trigger an exception.
        /// </summary> 
//        public bool 
        IsSealed:
        {
            get:function()
            { 
                return this._sealed;
            } 
        } 
	});
	
	SetterBaseCollection.Type = new Type("SetterBaseCollection", SetterBaseCollection, [Collection.Type]);
	return SetterBaseCollection;
});

///****************************************************************************\ 
//*
//* File: SetterBaseCollection.cs
//*
//* A collection of SetterBase-derived classes. See use in Style.cs and other 
//* places.
//* 
//* Copyright (C) by Microsoft Corporation.  All rights reserved. 
//*
//\***************************************************************************/ 
//
//using System.Collections.ObjectModel; // Collection<T>
//using System.Diagnostics;   // Debug.Assert
//using System.Windows.Data;  // Binding knowledge 
//using System.Windows.Media; // Visual knowledge
//using System.Windows.Markup; // MarkupExtension 
// 
//namespace System.Windows
//{ 
//    /// <summary>
//    ///     A collection of SetterBase objects to be used
//    ///     in Template and its trigger classes
//    /// </summary> 
//    public sealed class SetterBaseCollection : Collection<SetterBase>
//    { 
//        #region ProtectedMethods 
//
//        /// <summary> 
//        ///     ClearItems override
//        /// </summary>
//        protected override void ClearItems()
//        { 
//            CheckSealed();
//            base.ClearItems(); 
//        } 
//
//        /// <summary> 
//        ///     InsertItem override
//        /// </summary>
//        protected override void InsertItem(int index, SetterBase item)
//        { 
//            CheckSealed();
//            SetterBaseValidation(item); 
//            base.InsertItem(index, item); 
//        }
// 
//        /// <summary>
//        ///     RemoveItem override
//        /// </summary>
//        protected override void RemoveItem(int index) 
//        {
//            CheckSealed(); 
//            base.RemoveItem(index); 
//        }
// 
//        /// <summary>
//        ///     SetItem override
//        /// </summary>
//        protected override void SetItem(int index, SetterBase item) 
//        {
//            CheckSealed(); 
//            SetterBaseValidation(item); 
//            base.SetItem(index, item);
//        } 
//
//        #endregion ProtectedMethods
//
//        #region PublicMethods 
//
//        /// <summary> 
//        ///     Returns the sealed state of this object.  If true, any attempt 
//        ///     at modifying the state of this object will trigger an exception.
//        /// </summary> 
//        public bool IsSealed
//        {
//            get
//            { 
//                return _sealed;
//            } 
//        } 
//
//        #endregion PublicMethods 
//
//        #region InternalMethods
//
//        internal void Seal() 
//        {
//            _sealed = true; 
// 
//            // Seal all the setters
//            for (int i=0; i<Count; i++) 
//            {
//                this[i].Seal();
//            }
//        } 
//
//        #endregion InternalMethods 
// 
//        #region PrivateMethods
// 
//        private void CheckSealed()
//        {
//            if (_sealed)
//            { 
//                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SetterBaseCollection"));
//            } 
//        } 
//
//        private void SetterBaseValidation(SetterBase setterBase) 
//        {
//            if (setterBase == null)
//            {
//                throw new ArgumentNullException("setterBase"); 
//            }
//        } 
// 
//        #endregion PrivateMethods
// 
//        #region Data
//
//        private bool _sealed;
// 
//        #endregion Data
//    } 
//} 


