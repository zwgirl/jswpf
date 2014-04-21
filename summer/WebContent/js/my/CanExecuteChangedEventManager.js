/**
 * CanExecuteChangedEventManager
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var CanExecuteChangedEventManager = declare(null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(CanExecuteChangedEventManager.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	CanExecuteChangedEventManager.Type = new Type("CanExecuteChangedEventManager", CanExecuteChangedEventManager, [Object.Type]);
	return CanExecuteChangedEventManager;
});

//---------------------------------------------------------------------------- 
//
// <copyright file="CanExecuteChangedEventManager.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: Manager for the CanExecuteChanged event in the "weak event listener" 
//              pattern.  See WeakEventTable.cs for an overview. 
//
//--------------------------------------------------------------------------- 

using System;
using System.Collections;
using System.Collections.Generic; 
using System.Windows;       // WeakEventManager
 
namespace System.Windows.Input 
{
    /// <summary> 
    /// Manager for the ICommand.CanExecuteChanged event.
    /// </summary>
    public class CanExecuteChangedEventManager : WeakEventManager
    { 
        #region Constructors
 
        // 
        //  Constructors
        // 

        private CanExecuteChangedEventManager()
        {
            // In WPF 4.0, elements with commands (Button, Hyperlink, etc.) listened 
            // for CanExecuteChanged and also stored a strong reference to the handler
            // (in an uncommon field).   Some third-party commands relied on this 
            // undocumented implementation detail by storing a weak reference to 
            // the handler.  (One such example is Win8 Server Manager's DelegateCommand -
            // Microsoft.Management.UI.DelegateCommand<T> - see Win8 Bugs 588129.) 
            //
            // Commands that do this won't work with normal listeners:   the listener
            // simply calls command.CanExecuteChanged += new EventHandler(MyMethod);
            // the command stores a weak-ref to the handler, no one has a strong-ref 
            // so the handler is soon GC'd, after which the event doesn't get
            // delivered to the listener. 
            // 
            // In WPF 4.5, Button et al. use this weak event manager to listen to
            // CanExecuteChanged, indirectly.  Only the manager actually listens 
            // directly to the command's event.  For compat, the manager stores a
            // strong reference to its handler.   The only reason for this is to
            // support those commands that relied on the 4.0 implementation.
            _onCanExecuteChangedHandler = new EventHandler(OnCanExecuteChanged); 

            // BTW, the reason commands used weak-references was to avoid leaking 
            // the Button - see Dev11 267916.   This is fixed in 4.5, precisely 
            // by using the weak-event pattern.   Commands can now implement
            // the CanExecuteChanged event the default way - no need for any 
            // fancy weak-reference tricks (which people usually get wrong in
            // general, as in the case of DelegateCommand<T>).
        }
 
        #endregion Constructors
 
        #region Public Methods 

        // 
        //  Public Methods
        //

        /// <summary> 
        /// Add a handler for the given source's event.
        /// </summary> 
        public static void AddHandler(ICommand source, EventHandler<EventArgs> handler) 
        {
            if (source == null) 
                throw new ArgumentNullException("source");
            if (handler == null)
                throw new ArgumentNullException("handler");
 
            CurrentManager.ProtectedAddHandler(source, handler);
        } 
 
        /// <summary>
        /// Remove a handler for the given source's event. 
        /// </summary>
        public static void RemoveHandler(ICommand source, EventHandler<EventArgs> handler)
        {
            if (source == null) 
                throw new ArgumentNullException("source");
            if (handler == null) 
                throw new ArgumentNullException("handler"); 

            CurrentManager.ProtectedRemoveHandler(source, handler); 
        }

        #endregion Public Methods
 
        #region Protected Methods
 
        // 
        //  Protected Methods
        // 

        /// <summary>
        /// Return a new list to hold listeners to the event.
        /// </summary> 
        protected override ListenerList NewListenerList()
        { 
            return new ListenerList<EventArgs>(); 
        }
 
        /// <summary>
        /// Listen to the given source for the event.
        /// </summary>
        protected override void StartListening(object source) 
        {
            ICommand typedSource = (ICommand)source; 
 
            // try to listen to the event the normal way
            _proposedHandler = _onCanExecuteChangedHandler; // should be new EventHandler(OnCanExecuteChanged); - see comments in ctor 
            typedSource.CanExecuteChanged += _proposedHandler;

            // if the source (i.e. command) delegates to CommandManager.RequerySuggested,
            // then simulate that delegation instead 
            if (_proposedHandler == null)
            { 
                if (_commandManagerSources.Count == 0) 
                {
                    CommandManager.RequerySuggested += OnRequerySuggested; 
                }

                EnsureAccessToCommandManagerSources();
                _commandManagerSources.Add(source); 
            }
 
            _proposedHandler = null; 
        }
 
        /// <summary>
        /// Stop listening to the given source for the event.
        /// </summary>
        protected override void StopListening(object source) 
        {
            if (_commandManagerSources.Contains(source)) 
            { 
                // if the source delegates to CommandManager.RequerySuggested,
                // undo the simulated delegation 
                EnsureAccessToCommandManagerSources();
                _commandManagerSources.Remove(source);
                if (_commandManagerSources.Count == 0)
                { 
                    CommandManager.RequerySuggested -= OnRequerySuggested;
                } 
            } 
            else
            { 
                // Other ICommands raise the event the normal way
                ICommand typedSource = (ICommand)source;
                typedSource.CanExecuteChanged -= new EventHandler(OnCanExecuteChanged);
            } 
        }
 
        protected override bool Purge(object source, object data, bool purgeAll) 
        {
            bool result1 = base.Purge(source, data, purgeAll); 
            EnsureAccessToCommandManagerSources();
            bool result2 = _commandManagerSources.Purge();
            return result1 || result2;
        } 

        // Some sources delegate their CanExecuteChanged event to CommandManager.RequerySuggested. 
        // RoutedCommands do this, as well as some custom commands (dev11 281808). 
        // We can't let the CommandManager raise the event directly to the listener - that
        // would defeat the weak-event pattern, and would also deliver the event with a null 
        // sender (instead of the source).  Instead, we detect sources that do this delegation,
        // and redirect the event through the CanExecuteChangedManager.   CommandManager
        // calls this method to do the detection.
        internal static bool IsSourceDelegatingToCommandManager(EventHandler handler) 
        {
            CanExecuteChangedEventManager manager = CurrentManager; 
 
            // _proposedHandler is set during StartListening, while we're adding
            // a listener to a source. 
            if (Object.ReferenceEquals(handler, manager._proposedHandler))
            {
                // the source has passed the same handler to CommandManager.RequerySuggested,
                // so we should simulate the delegation. 
                manager._proposedHandler = null;    // tell CanExecuteChangedManager
                return true;                        // tell CommandManager 
            } 
            else
            { 
                return false;                       // (leave _proposedHandler alone)
            }
        }
 
        #endregion Protected Methods
 
        #region Private Properties 

        // 
        //  Private Properties
        //

        // get the event manager for the current thread 
        private static CanExecuteChangedEventManager CurrentManager
        { 
            get 
            {
                Type managerType = typeof(CanExecuteChangedEventManager); 
                CanExecuteChangedEventManager manager = (CanExecuteChangedEventManager)GetCurrentManager(managerType);

                // at first use, create and register a new manager
                if (manager == null) 
                {
                    manager = new CanExecuteChangedEventManager(); 
                    SetCurrentManager(managerType, manager); 
                }
 
                return manager;
            }
        }
 
        #endregion Private Properties
 
        #region Private Methods 

        // 
        //  Private Methods
        //

        // event handler for CanExecuteChanged event 
        private void OnCanExecuteChanged(object sender, EventArgs args)
        { 
            DeliverEvent(sender, args); 
        }
 
        // event handler for CommandManager.RequerySuggested event
        private void OnRequerySuggested(object sender, EventArgs args)
        {
            try 
            {
                _inOnRequerySuggested = true; 
                foreach (object source in _commandManagerSources) 
                {
                    DeliverEvent(source, args); 
                }
            }
            finally
            { 
                _inOnRequerySuggested = false;
            } 
        } 

        // If someone adds/removes a CommandManager source while we're delivering 
        // the RequerySuggested event, we don't want to add/remove to the hashtable
        // that's being enumerated.  Instead, make a copy of the hashtable and
        // add/remove to the copy, letting the enumeration continue on the (now
        // orphaned) original.   Doing it this way avoids allocations and other 
        // expense in the 99% case where no re-entrancy occurs.
        private void EnsureAccessToCommandManagerSources() 
        { 
            if (_inOnRequerySuggested)
            { 
                // re-entrancy has occurred.  Copy the hashtable
                _commandManagerSources = new SourceTable(_commandManagerSources);

                // now that we've copied the table, we don't need the re-entrancy check 
                _inOnRequerySuggested = false;
            } 
        } 

        #endregion Private Methods 

        #region Private Data

        SourceTable _commandManagerSources = new SourceTable(); 
        bool _inOnRequerySuggested;
        EventHandler _proposedHandler; 
        EventHandler _onCanExecuteChangedHandler;   // see remarks in the constructor 

        #endregion Private Data 

        #region SourceTable

        private class SourceTable : IEnumerable 
        {
            Dictionary<WeakRefKey, object> _table; 
 
            public SourceTable()
            { 
                _table = new Dictionary<WeakRefKey, object>();
            }

            public SourceTable(SourceTable table) 
            {
                _table = new Dictionary<WeakRefKey, object>(table._table); 
            } 

            public int Count { get { return _table.Count; } }   // includes stale entries.  That's OK. 

            public bool Contains(object source)
            {
                object dummy; 
                return _table.TryGetValue(new WeakRefKey(source), out dummy);
            } 
 
            public void Add(object source)
            { 
                _table.Add(new WeakRefKey(source), null);
            }

            public void Remove(object source) 
            {
                _table.Remove(new WeakRefKey(source)); 
            } 

            IEnumerator IEnumerable.GetEnumerator() 
            {
                return new WeakEnumerator(_table);
            }
 
            // remove entries whose key has been GC'd.  Return true if anything got removed.
            internal bool Purge() 
            { 
                List<WeakRefKey> list = new List<WeakRefKey>();
                foreach (KeyValuePair<WeakRefKey, object> kvp in _table) 
                {
                    WeakRefKey key = kvp.Key;
                    if (key.Target == null)
                    { 
                        list.Add(key);
                    } 
                } 

                for (int k=0; k<list.Count; ++k) 
                {
                    _table.Remove(list[k]);
                }
 
                return (list.Count > 0);
            } 
 
            private class WeakEnumerator : IEnumerator, IDisposable
            { 
                internal WeakEnumerator(Dictionary<WeakRefKey, object> table)
                {
                    _de = (Dictionary<WeakRefKey, object>.Enumerator)table.GetEnumerator();
                } 

                object IEnumerator.Current 
                { 
                    get { return _de.Current.Key.Target; }
                } 

                bool IEnumerator.MoveNext()
                {
                    while (_de.MoveNext()) 
                    {
                        if (_de.Current.Key.Target != null) 
                            return true; 
                    }
 
                    _de.Dispose();
                    return false;
                }
 
                void IEnumerator.Reset()
                { 
                    ((IEnumerator)_de).Reset(); 
                }
 
                void IDisposable.Dispose()
                {
                    _de.Dispose();
                } 

                Dictionary<WeakRefKey, object>.Enumerator _de; 
            } 

            private class WeakRefKey 
            {
                //-----------------------------------------------------
                //
                //  Constructors 
                //
                //----------------------------------------------------- 
 
                internal WeakRefKey(object target)
                { 
                    _weakRef = new WeakReference(target);
                    _hashCode = (target != null) ? target.GetHashCode() : 314159;
                }
 
                //------------------------------------------------------
                // 
                //  Internal Properties 
                //
                //----------------------------------------------------- 

                internal object Target
                {
                    get { return _weakRef.Target; } 
                }
 
                //------------------------------------------------------ 
                //
                //  Public Methods 
                //
                //------------------------------------------------------

                public override int GetHashCode() 
                {
                    return _hashCode; 
                } 

                public override bool Equals(object o) 
                {
                    if (o is WeakRefKey)
                    {
                        WeakRefKey ck = (WeakRefKey)o; 
                        object c1 = Target;
                        object c2 = ck.Target; 
 
                        if (c1!=null && c2!=null)
                            return (c1 == c2); 
                        else
                            return (_weakRef == ck._weakRef);
                    }
                    else 
                    {
                        return false; 
                    } 
                }
 
                // overload operator for ==, to be same as Equal implementation.
                public static bool operator ==(WeakRefKey left, WeakRefKey right)
                {
                    if ((object)left == null) 
                        return (object)right == null;
 
                    return left.Equals(right); 
                }
 
                // overload operator for !=, to be same as Equal implementation.
                public static bool operator !=(WeakRefKey left, WeakRefKey right)
                {
                    return !(left == right); 
                }
 
                //----------------------------------------------------- 
                //
                //  Private Fields 
                //
                //------------------------------------------------------

                WeakReference   _weakRef; 
                int             _hashCode;  // cache target's hashcode, lest it get GC'd out from under us
            } 
        } 

        #endregion SourceTable 
    }
}


