/**
 * TriggerCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection", "internal/InheritanceContextHelper"], 
		function(declare, Type, Collection, InheritanceContextHelper){
	var TriggerCollection = declare("TriggerCollection", Collection, {
	 	"-chains-": {
	 		constructor: "manual"
	    },
		constructor:function(/*FrameworkElement*/ owner){
			Collection.prototype.constructor.call(this);
			if(owner != undefined){
				this._owner = owner; 
			}else{
				this._owner = null;
			}
            this._sealed = false;

		},

        /// <summary> 
        ///     ClearItems override
        /// </summary> 
//        protected override void 
        ClearItems:function() 
        {
            this.CheckSealed(); 
            this.OnClear();
            Collection.prototype.ClearItems.call(this);
        },
 
        /// <summary>
        ///     InsertItem override 
        /// </summary> 
//        protected override void 
        InsertItem:function(/*int*/ index, /*TriggerBase*/ item)
        { 
        	this.CheckSealed();
        	this.TriggerBaseValidation(item);
        	this.OnAdd(item);
            Collection.prototype.InsertItem.call(this, index, item); 
        },
 
        /// <summary> 
        ///     RemoveItem override
        /// </summary> 
//        protected override void 
        RemoveItem:function(/*int*/ index)
        {
        	this.CheckSealed();
        	var triggerBase = this.Get(index); 
        	this.OnRemove(triggerBase);
        	Collection.prototype.RemoveItem.call(this, index); 
        },

        /// <summary> 
        ///     SetItem override
        /// </summary>
//        protected override void 
        SetItem:function(/*int*/ index, /*TriggerBase*/ item)
        { 
        	this.CheckSealed();
        	this.TriggerBaseValidation(item); 
        	this.OnAdd(item); 
            Collection.prototype.SetItem.call(this, index, item);
        },
        

//        internal void 
        Seal:function() 
        {
//            Debug.Assert (Owner == null); 
 
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
                throw new Error('InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "TriggerCollection")'); 
            } 
        },
 
//        private void 
        TriggerBaseValidation:function(/*TriggerBase*/ triggerBase)
        {
            if (triggerBase == null)
            { 
                throw new Error('ArgumentNullException("triggerBase")');
            } 
        }, 

        // Called by GenericCollection.tb when a trigger is added to the collection. 
        // We use this opportunity to hook it into the tree.
//        private void 
        OnAdd:function( /*TriggerBase*/ triggerBase )
        {
            // If we don't have an Owner (the Style/Template case), or the 
            // element isn't initialized yet, we don't need to do anything
            if (this.Owner != null && this.Owner.IsInitialized) 
            { 
                EventTrigger.ProcessOneTrigger(this.Owner, triggerBase);
            } 

            InheritanceContextHelper.ProvideContextForObject(this.Owner, triggerBase);

        },

        // Called by GenericCollection.tb when a trigger is removed from the collection. 
        // We use this opportunity to pull its hooks out of the tree. 
//        private void 
        OnRemove:function( /*TriggerBase*/ triggerBase )
        { 
            // If we don't have an Owner (the Style/Template case),
 			// we don't need to do anything
			if (this.Owner != null)
			{ 
				// If the owner is initialized, we need to disconnect the trigger.
 				if (this.Owner.IsInitialized) 
				{ 
 					EventTrigger.DisconnectOneTrigger(this.Owner, triggerBase);
 				} 

				// We always need to update the inheritance context
 				InheritanceContextHelper.RemoveContextFromObject(this.Owner, triggerBase); 
			}
        },

        // Called by GenericCollection.tb when the collection is cleared. 
        // We use this opportunity to pull all the hooks out of the tree.
//        private void 
        OnClear:function()
        {
			// If we don't have an Owner (the Style/Template case), 
			// we don't need to do anything
 			if (this.Owner != null) 
			{ 
 				// If the owner is initialized, we need to disconnect all the trigger.
 				if (Owner.IsInitialized) 
				{
 					EventTrigger.DisconnectAllTriggers(this.Owner);
				}
 
				// We always need to update the inheritance context
				for (var i = this.Count - 1; i >= 0; i--) 
 				{ 
					InheritanceContextHelper.RemoveContextFromObject(this.Owner, this[i]);
 				} 
 			}
        }

	});
	
	Object.defineProperties(TriggerCollection.prototype,{

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
        },
        
        // This may be null (i.e. when used in a style or template)
//        internal FrameworkElement 
        Owner:
        {
            get:function() { return this._owner; }
        }
        
	});
	
	TriggerCollection.Type = new Type("TriggerCollection", TriggerCollection, [Collection.Type]);
	return TriggerCollection;
});

///****************************************************************************\ 
//*
//* File: TriggerCollection.cs
//*
//* A collection of TriggerBase-derived classes. See use in Style.cs and other 
//* places.
//* 
//* Copyright (C) by Microsoft Corporation.  All rights reserved. 
//*
//\***************************************************************************/ 
//
//using System.Diagnostics;
//using System.Collections.Generic;
//using System.Collections.ObjectModel; // Collection<T> 
//using MS.Internal;
// 
//namespace System.Windows 
//{
//    /// <summary> 
//    ///     A set of TriggerBase's
//    /// </summary>
//    [Localizability(LocalizationCategory.None, Readability=Readability.Unreadable)]
//    public sealed class TriggerCollection : Collection<TriggerBase> 
//    {
//        #region Constructors 
 
//        internal TriggerCollection() : this(null)
//        { 
//        }
//
//        internal TriggerCollection(FrameworkElement owner) : base()
//        { 
//            _sealed = false;
//            _owner = owner; 
//        } 
//
//        #endregion Constructors 
//
//        #region ProtectedMethods
//
//        /// <summary> 
//        ///     ClearItems override
//        /// </summary> 
//        protected override void ClearItems() 
//        {
//            CheckSealed(); 
//            OnClear();
//            base.ClearItems();
//        }
// 
//        /// <summary>
//        ///     InsertItem override 
//        /// </summary> 
//        protected override void InsertItem(int index, TriggerBase item)
//        { 
//            CheckSealed();
//            TriggerBaseValidation(item);
//            OnAdd(item);
//            base.InsertItem(index, item); 
//        }
// 
//        /// <summary> 
//        ///     RemoveItem override
//        /// </summary> 
//        protected override void RemoveItem(int index)
//        {
//            CheckSealed();
//            TriggerBase triggerBase = this[index]; 
//            OnRemove(triggerBase);
//            base.RemoveItem(index); 
//        } 
//
//        /// <summary> 
//        ///     SetItem override
//        /// </summary>
//        protected override void SetItem(int index, TriggerBase item)
//        { 
//            CheckSealed();
//            TriggerBaseValidation(item); 
//            OnAdd(item); 
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
//            Debug.Assert (Owner == null); 
// 
//            _sealed = true;
// 
//            // Seal all the setters
//            for (int i=0; i<Count; i++)
//            {
//                this[i].Seal(); 
//            }
//        } 
// 
//        // This may be null (i.e. when used in a style or template)
//        internal FrameworkElement Owner 
//        {
//            get { return _owner; }
//        }
// 
//
// 
//        #endregion InternalMethods 
//
//        #region PrivateMethods 
//
//        private void CheckSealed()
//        {
//            if (_sealed) 
//            {
//                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "TriggerCollection")); 
//            } 
//        }
// 
//        private void TriggerBaseValidation(TriggerBase triggerBase)
//        {
//            if (triggerBase == null)
//            { 
//                throw new ArgumentNullException("triggerBase");
//            } 
//        } 
//
//        // Called by GenericCollection.tb when a trigger is added to the collection. 
//        // We use this opportunity to hook it into the tree.
//        private void OnAdd( TriggerBase triggerBase )
//        {
//            // If we don't have an Owner (the Style/Template case), or the 
//            // element isn't initialized yet, we don't need to do anything
//            if (Owner != null && Owner.IsInitialized) 
//            { 
//                EventTrigger.ProcessOneTrigger(Owner, triggerBase);
//            } 
//
//            InheritanceContextHelper.ProvideContextForObject(Owner, triggerBase);
//
//        } 
//
//        // Called by GenericCollection.tb when a trigger is removed from the collection. 
//        // We use this opportunity to pull its hooks out of the tree. 
//        private void OnRemove( TriggerBase triggerBase )
//        { 
//            // If we don't have an Owner (the Style/Template case),
// 			// we don't need to do anything
//			if (Owner != null)
//			{ 
//				// If the owner is initialized, we need to disconnect the trigger.
// 				if (Owner.IsInitialized) 
//				{ 
// 					EventTrigger.DisconnectOneTrigger(Owner, triggerBase);
// 				} 
//
//				// We always need to update the inheritance context
//
// 				InheritanceContextHelper.RemoveContextFromObject(Owner, triggerBase); 
//			}
// 
//        } 
//
//        // Called by GenericCollection.tb when the collection is cleared. 
//        // We use this opportunity to pull all the hooks out of the tree.
//        private void OnClear()
//        {
//			// If we don't have an Owner (the Style/Template case), 
//			// we don't need to do anything
// 			if (Owner != null) 
//			{ 
// 				// If the owner is initialized, we need to disconnect all the trigger.
// 				if (Owner.IsInitialized) 
//				{
// 					EventTrigger.DisconnectAllTriggers(Owner);
//				}
// 
//				// We always need to update the inheritance context
//				for (int i = Count - 1; i >= 0; i--) 
// 				{ 
//					InheritanceContextHelper.RemoveContextFromObject(Owner, this[i]);
// 				} 
// 			}
//        }
//
//        #endregion PrivateMethods 
//
//        #region Data 
// 
//        private bool _sealed;
//        private FrameworkElement _owner; 
//
//        #endregion Data
//
//    } 
//}
 
