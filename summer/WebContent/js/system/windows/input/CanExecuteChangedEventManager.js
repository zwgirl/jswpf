/**
 * CanExecuteChangedEventManager
 */

define(["dojo/_base/declare", "system/Type", "windows/WeakEventManager", "generic/Dictionary","windows/ListenerList"], 
		function(declare, Type, WeakEventManager, Dictionary, ListenerList){
	
//	 private class 
	var WeakEnumerator =declare([IEnumerator, IDisposable], { 
         constructor:function(/*Dictionary<WeakRefKey, object>*/ table)
         {
             this._de = /*(Dictionary<WeakRefKey, object>.Enumerator)*/table.GetEnumerator();
         }, 

//         bool IEnumerator.
         MoveNext:function()
         {
             while (this._de.MoveNext()) 
             {
                 if (this._de.Current.Key.Target != null) 
                     return true; 
             }

             this._de.Dispose();
             return false;
         },

//         void IEnumerator.
         Reset:function()
         { 
             this._de.Reset(); 
         },

//         void IDisposable.
         Dispose:function()
         {
             this._de.Dispose();
         } 
     });
	
	Object.defineProperties(WeakEnumerator.prototype, {
//		object IEnumerator.
		Current: 
        { 
        	get:function() { return this._de.Current.Key.Target; }
        }
	});

//     private class 
	var WeakRefKey = declare(Object, {
         constructor:function(/*object*/ target)
         { 
             this._target = target; //new WeakReference(target);
             this._hashCode = (target != null) ? target.GetHashCode() : 314159;
         },

//         public override int 
         GetHashCode:function() 
         {
             return this._hashCode; 
         }, 

//         public override bool 
         Equals:function(/*object*/ o) 
         {
             if (o instanceof WeakRefKey)
             {
//                 WeakRefKey ck = (WeakRefKey)o; 
                 var c1 = this.Target;
                 var c2 = ck.Target; 

                 if (c1!=null && c2!=null)
                     return (c1 == c2); 
                 else
                     return (this.Target == ck.Target);
             }
             else 
             {
                 return false; 
             } 
         }
     });
	
	Object.defineProperties(WeakRefKey.prototype, {

//        internal object 
		Target:
        {
            get:function() { return this.target; } 
        }
	});
	
//	 private class 
	var SourceTable =declare(IEnumerable, {
//         Dictionary<WeakRefKey, object> _table; 

		constructor:function(/*SourceTable*/ table) 
		{
			if(table === undefined){
				table = null;
			}
             
			if(table ==null){
				this._table = new Dictionary/*<WeakRefKey, object>*/();
			}else{
				this._table = new Dictionary/*<WeakRefKey, object>*/(table._table); 
			}
		}, 
//         public bool 
		Contains:function(/*object*/ source)
		{
			var dummy; 
			return this._table.TryGetValue(new WeakRefKey(source), /*out dummy*/dummyOut);
		},

//         public void 
		Add:function(/*object*/ source)
		{ 
			this._table.Add(new WeakRefKey(source), null);
		},

//         public void 
		Remove:function(/*object*/ source) 
		{
			this._table.Remove(new WeakRefKey(source)); 
		}, 

//         IEnumerator IEnumerable.
		GetEnumerator:function() 
		{
			return new WeakEnumerator(this._table);
		},
//
//         // remove entries whose key has been GC'd.  Return true if anything got removed.
//         internal bool Purge() 
//         { 
//             List<WeakRefKey> list = new List<WeakRefKey>();
//             foreach (KeyValuePair<WeakRefKey, object> kvp in _table) 
//             {
//                 WeakRefKey key = kvp.Key;
//                 if (key.Target == null)
//                 { 
//                     list.Add(key);
//                 } 
//             } 
//
//             for (int k=0; k<list.Count; ++k) 
//             {
//                 _table.Remove(list[k]);
//             }
//
//             return (list.Count > 0);
//         } 

         
	});
	 
	Object.defineProperties(SourceTable.prototype, {
//         public int 
		Count: { get:function() { return this._table.Count; } }   // includes stale entries.  That's OK. 
	});
	 
	 SourceTable.Type = new Type("SourceTable", SourceTable, [IEnumerable.Type]);
	var CanExecuteChangedEventManager = declare("CanExecuteChangedEventManager", WeakEventManager,{
		constructor:function(){
            this._onCanExecuteChangedHandler = new EventHandler(this, this.OnCanExecuteChanged); 
            
//            bool 
            this._inOnRequerySuggested = false;
//            EventHandler 
            this._proposedHandler = null; 
//            EventHandler 
            this._onCanExecuteChangedHandler = null;   // see remarks in the constructor 
            
//            SourceTable 
            this._commandManagerSources = new SourceTable(); 
		},
		
	       // event handler for CanExecuteChanged event 
//        private void 
        OnCanExecuteChanged:function(/*object*/ sender, /*EventArgs*/ args)
        { 
            this.DeliverEvent(sender, args); 
        },
 
        // event handler for CommandManager.RequerySuggested event
//        private void 
        OnRequerySuggested:function(/*object*/ sender, /*EventArgs*/ args)
        {
            try 
            {
                this._inOnRequerySuggested = true; 
                for/*each*/ (var i=0; i<this._commandManagerSources.Count; i++) ///*object*/var source in _commandManagerSources) 
                {
                	this.DeliverEvent(this._commandManagerSources.Get(i), args); 
                }
            }
            finally
            { 
            	this._inOnRequerySuggested = false;
            } 
        }, 

        // If someone adds/removes a CommandManager source while we're delivering 
        // the RequerySuggested event, we don't want to add/remove to the hashtable
        // that's being enumerated.  Instead, make a copy of the hashtable and
        // add/remove to the copy, letting the enumeration continue on the (now
        // orphaned) original.   Doing it this way avoids allocations and other 
        // expense in the 99% case where no re-entrancy occurs.
//        private void 
        EnsureAccessToCommandManagerSources:function() 
        { 
            if (this._inOnRequerySuggested)
            { 
                // re-entrancy has occurred.  Copy the hashtable
            	this._commandManagerSources = new SourceTable(this._commandManagerSources);

                // now that we've copied the table, we don't need the re-entrancy check 
            	this._inOnRequerySuggested = false;
            } 
        },
        
        /// <summary>
        /// Return a new list to hold listeners to the event.
        /// </summary> 
//        protected override ListenerList 
        NewListenerList:function()
        { 
            return new ListenerList/*<EventArgs>*/(); 
        },
 
        /// <summary>
        /// Listen to the given source for the event.
        /// </summary>
//        protected override void 
        StartListening:function(/*object*/ source) 
        {
            /*ICommand*/
        	var typedSource = source; 
 
            // try to listen to the event the normal way
            this._proposedHandler = this._onCanExecuteChangedHandler; // should be new EventHandler(OnCanExecuteChanged); - see comments in ctor 
            typedSource.CanExecuteChanged.Combine(this._proposedHandler);

            // if the source (i.e. command) delegates to CommandManager.RequerySuggested,
            // then simulate that delegation instead 
            if (this._proposedHandler == null)
            { 
                if (this._commandManagerSources.Count == 0) 
                {
                    CommandManager.AddRequerySuggestedHandler(new EventHandler(this, this.OnRequerySuggested)); 
                }

                this.EnsureAccessToCommandManagerSources();
                this._commandManagerSources.Add(source); 
            }
 
            this._proposedHandler = null; 
        },
 
        /// <summary>
        /// Stop listening to the given source for the event.
        /// </summary>
//        protected override void 
        StopListening:function(/*object*/ source) 
        {
            if (this._commandManagerSources.Contains(source)) 
            { 
                // if the source delegates to CommandManager.RequerySuggested,
                // undo the simulated delegation 
            	this.EnsureAccessToCommandManagerSources();
                this._commandManagerSources.Remove(source);
                if (this._commandManagerSources.Count == 0)
                { 
                    CommandManager.RemoveAddRequerySuggestedHandler(new EventHandler(this, this.OnRequerySuggested));
                } 
            } 
            else
            { 
                // Other ICommands raise the event the normal way
                /*ICommand*/var typedSource = source;
                typedSource.CanExecuteChanged.Remove(new EventHandler(this, this.OnCanExecuteChanged));
            } 
        },
 
////        protected override bool 
//        Purge:function(/*object*/ source, /*object*/ data, /*bool*/ purgeAll) 
//        {
//            /*bool*/var result1 = base.Purge(source, data, purgeAll); 
//            this.EnsureAccessToCommandManagerSources();
//            /*bool*/var result2 = this._commandManagerSources.Purge();
//            return result1 || result2;
//        } 

	});
	
	Object.defineProperties(CanExecuteChangedEventManager,{
		// get the event manager for the current thread 
//        private static CanExecuteChangedEventManager 
        CurrentManager:
        { 
            get:function()
            {
                /*Type*/var managerType = CanExecuteChangedEventManager.Type/*typeof(CanExecuteChangedEventManager)*/; 
                /*CanExecuteChangedEventManager*/var manager = WeakEventManager.GetCurrentManager(managerType);

                // at first use, create and register a new manager
                if (manager == null) 
                {
                    manager = new CanExecuteChangedEventManager(); 
                    WeakEventManager.SetCurrentManager(managerType, manager); 
                }
 
                return manager;
            }
        }
	});
	
    /// <summary> 
    /// Add a handler for the given source's event.
    /// </summary> 
//    public static void 
	CanExecuteChangedEventManager.AddHandler = function(/*ICommand*/ source, /*EventHandler<EventArgs>*/ handler) 
    {
        if (source == null) 
            throw new ArgumentNullException("source");
        if (handler == null)
            throw new ArgumentNullException("handler");

        CanExecuteChangedEventManager.CurrentManager.ProtectedAddHandler(source, handler);
    };

    /// <summary>
    /// Remove a handler for the given source's event. 
    /// </summary>
//    public static void 
    CanExecuteChangedEventManager.RemoveHandler = function(/*ICommand*/ source, /*EventHandler<EventArgs>*/ handler)
    {
        if (source == null) 
            throw new ArgumentNullException("source");
        if (handler == null) 
            throw new ArgumentNullException("handler"); 

        CanExecuteChangedEventManager.CurrentManager.ProtectedRemoveHandler(source, handler); 
    };



    // Some sources delegate their CanExecuteChanged event to CommandManager.RequerySuggested. 
    // RoutedCommands do this, as well as some custom commands (dev11 281808). 
    // We can't let the CommandManager raise the event directly to the listener - that
    // would defeat the weak-event pattern, and would also deliver the event with a null 
    // sender (instead of the source).  Instead, we detect sources that do this delegation,
    // and redirect the event through the CanExecuteChangedManager.   CommandManager
    // calls this method to do the detection.
//    internal static bool 
    CanExecuteChangedEventManager.IsSourceDelegatingToCommandManager = function(/*EventHandler*/ handler) 
    {
        /*CanExecuteChangedEventManager*/var manager = CanExecuteChangedEventManager.CurrentManager; 

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
    };

	
	CanExecuteChangedEventManager.Type = new Type("CanExecuteChangedEventManager", 
			CanExecuteChangedEventManager, [WeakEventManager.Type]);
	return CanExecuteChangedEventManager;
});

//        private CanExecuteChangedEventManager()
//        {
//            // In WPF 4.0, elements with commands (Button, Hyperlink, etc.) listened 
//            // for CanExecuteChanged and also stored a strong reference to the handler
//            // (in an uncommon field).   Some third-party commands relied on this 
//            // undocumented implementation detail by storing a weak reference to 
//            // the handler.  (One such example is Win8 Server Manager's DelegateCommand -
//            // Microsoft.Management.UI.DelegateCommand<T> - see Win8 Bugs 588129.) 
//            //
//            // Commands that do this won't work with normal listeners:   the listener
//            // simply calls command.CanExecuteChanged += new EventHandler(MyMethod);
//            // the command stores a weak-ref to the handler, no one has a strong-ref 
//            // so the handler is soon GC'd, after which the event doesn't get
//            // delivered to the listener. 
//            // 
//            // In WPF 4.5, Button et al. use this weak event manager to listen to
//            // CanExecuteChanged, indirectly.  Only the manager actually listens 
//            // directly to the command's event.  For compat, the manager stores a
//            // strong reference to its handler.   The only reason for this is to
//            // support those commands that relied on the 4.0 implementation.
//            _onCanExecuteChangedHandler = new EventHandler(OnCanExecuteChanged); 
//
//            // BTW, the reason commands used weak-references was to avoid leaking 
//            // the Button - see Dev11 267916.   This is fixed in 4.5, precisely 
//            // by using the weak-event pattern.   Commands can now implement
//            // the CanExecuteChanged event the default way - no need for any 
//            // fancy weak-reference tricks (which people usually get wrong in
//            // general, as in the case of DelegateCommand<T>).
//        }
