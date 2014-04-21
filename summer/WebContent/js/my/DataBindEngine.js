/**
 * DataBindEngine
 */

define(["dojo/_base/declare", "system/Type", "internal.data/TaskOps", "internal.data/PathParser",
        "internal.data/ValueTable",
        "internal.data/AccessorTable"], 
		function(declare, Type, TaskOps, PathParser, 
				ValueTable,
				AccessorTable){
	
	var ViewManager = null;
	function EnsureViewManager(){
		if(ViewManager == null){
			ViewManager = using("internal.data/ViewManager");
		}
		
		return ViewManager;
	}
	
	var CommitManager = null;
	function EnsureCommitManager(){
		if(CommitManager == null){
			CommitManager = using("internal.data/CommitManager");
		}
		
		return CommitManager;
	}
	
	var Key = declare("Key", null,{
		constructor:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource) 
        {
            this._sourceType = sourceType; 
            this._targetType = targetType;
            this._targetToSource = targetToSource;
        },
        
        toString:function(){
        	return this._sourceType.Id + '_' + this._targetType.Id;
        }
	});
 
	
	var ValueConverterTable = declare("EmptyEnumerator", Object,{
		constructor:function(){
            this._values = {};
		},
		
//	    public void 
	    Add:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource, /*IValueConverter*/ value) 
	    { 
	    	this._values[new Key(sourceType, targetType, targetToSource)] = value;
	    },
	    
//	    public IValueConverter 
	    Get:function(/*Type*/ sourceType, /*Type*/ targetType, /*bool*/ targetToSource){
            return this._values[new Key(sourceType, targetType, targetToSource)];
        }
	});


    var Status = declare(Object,{ 
    });	
    
    Status.Pending=0;
    Status.Running=1;
    Status.Completed=2;
    Status.Retry=3;
    Status.Cancelled=4;

    
    //-----------------------------------------------------
    // 
    //  Nested classes 
    //
    //----------------------------------------------------- 

    // The task list is represented by a singly linked list of Tasks
    // connected via the Next pointer.  The variables _head and _tail
    // point to the beginning and end of the list.  The head is always 
    // a dummy Task that is never used for anything else - this makes
    // the code for adding to the list simpler. 
    // 
    // In addition, all tasks for a particular client are linked in
    // reverse order of arrival by the PreviousForClient back pointer. 
    // The heads of these lists are kept in the _mostRecentForClient
    // hashtable.  This allows rapid cancellation of all tasks pending
    // for a particular client - we only need to look at the tasks that
    // are actually affected, rather than the entire list.  This avoids 
    // an O(n^2) algorithm (bug 1366032).

	var Task = declare("EmptyEnumerator", null,{
		constructor:function(/*IDataBindEngineClient*/ c, /*TaskOps*/ o, /*Task*/ previousForClient) 
        {
            this._client = c; 
            this._op = o;
            this._PreviousForClient = previousForClient;
            this._status = Status.Pending;
        },
        
//        public void 
        Run:function(/*bool*/ lastChance) 
        { 
            status = Status.Running;
            var newStatus = Status.Completed; 
            switch (op)
            {
                case TaskOps.TransferValue:
                    client.TransferValue(); 
                    break;

                case TaskOps.UpdateValue: 
                    client.UpdateValue();
                    break; 

                case TaskOps.RaiseTargetUpdatedEvent:
                    client.OnTargetUpdated();
                    break; 

                case TaskOps.AttachToContext: 
                    var succeeded = client.AttachToContext(lastChance); 
                    if (!succeeded && !lastChance)
                        newStatus = Status.Retry; 
                    break;

                case TaskOps.VerifySourceReference:
                    client.VerifySourceReference(lastChance); 
                    break;
            } 
            status = newStatus; 
        }
	});
	
	Task.Status = Status;
	
	Object.defineProperties(Task.prototype,{
//        public IDataBindEngineClient 
        client:
        {
        	get:function(){
        		return this._client;
        	},
        	set:function(value)
        	{
        		this._client=value;
        	}
        	
        },
//        public TaskOps 
        op:
        {
        	get:function(){
        		return this._op;
        	},
        	set:function(value)
        	{
        		this._op=value;
        	}
        	
        },
//        public Status 
        status:
        {
        	get:function(){
        		return this._status;
        	},
        	set:function(value)
        	{
        		this._status=value;
        	}
        	
        },
//        public Task 
        Next:
        {
        	get:function(){
        		return this._next;
        	},
        	set:function(value)
        	{
        		this._next=value;
        	}
        	
        }, 
//        public Task 
        PreviousForClient:
        {
        	get:function(){
        		return this._previousForClient;
        	},
        	set:function(value)
        	{
        		this._previousForClient=value;
        	}
        	
        }
	});
	
	var DataBindEngine = declare(null,{
		constructor:function( ){
            // Set up the final cleanup 
//            DataBindEngineShutDownListener listener = new DataBindEngineShutDownListener(this);
 
            // initialize the task list
            this._head = new Task(null, TaskOps.TransferValue, null);
            this._tail = this._head;
//            this._mostRecentTask = new HybridDictionary(); 
            
            this.initialize();
            
            
		},
		
		initialize:function(){
	        this._viewManager = new (EnsureViewManager())();
	        this._commitManager = new EnsureCommitManager()(); 
	        this._valueConverterTable = new ValueConverterTable(); 
	        this._pathParser = new PathParser();
//	        this._valueConverterContext = new ValueConverterContext();   //cym comment

	        this._cleanupEnabled = true; 

	        this._valueTable = new ValueTable(); 
	        this._accessorTable = new AccessorTable(); 
	 
//	        this._crossThreadQueue = new Queue<DataBindOperation>();
//	        v_crossThreadQueueLock = new object();
		},


 
        //----------------------------------------------------- 
        //
        //  Internal Methods 
        //
        //------------------------------------------------------

//        internal void 
        AddTask:function(/*IDataBindEngineClient*/ c, /*TaskOps*/ op) 
        {
            // ignore requests that arrive after shutdown 
            if (this._mostRecentTask == null) 
                return;
 
            // if we're adding to an empty list, request that the list be processed
            if (this._head == this._tail)
            {
                this.RequestRun(); 
            }
 
            // link a new task into the list 
            /*Task*/
            var recentTask = this._mostRecentTask[c];
            var newTask = new Task(c, op, recentTask); 
            this._tail.Next = newTask;
            this._tail = newTask;
            this._mostRecentTask.Set(c, newTask);
 
            // if the task is AttachToContext and the target is a UIElement,
            // register for the LayoutUpdated event, and run the task list from the 
            // event handler.  This avoids flashing, at the expense of lots more 
            // events and handlers (bug 1019232)
            if (op == TaskOps.AttachToContext && 
            		this._layoutElement == null &&
                (this._layoutElement = (c.TargetElement instanceof UIElement ? c.TargetElement : null)) != null)
            {
            	this._layoutElement.LayoutUpdated += new EventHandler(OnLayoutUpdated); 
            }
        },
 
//        internal void 
        CancelTask:function(/*IDataBindEngineClient*/ c, /*TaskOps*/ op)
        { 
            // ignore requests that arrive after shutdown
            if (this._mostRecentTask == null)
                return;
 
            for (var task = this._mostRecentTask.Get(c);  task != null;  task = task.PreviousForClient)
            { 
                if (task.op == op && task.status == Task.Status.Pending) 
                {
                    task.status = Task.Status.Cancelled; 
                    break;
                }
            }
        },

//        internal void 
        CancelTasks:function(/*IDataBindEngineClient*/ c) 
        { 
            // ignore requests that arrive after shutdown
            if (this._mostRecentTask == null) 
                return;

            // cancel pending tasks for the given client
            for (var task = this._mostRecentTask.Get(c);  task != null;  task = task.PreviousForClient) 
            {
//                Invariant.Assert(task.client == c, "task list is corrupt"); 
                if (task.status == Task.Status.Pending) 
                {
                    task.status = Task.Status.Cancelled; 
                }
            }

            // no need to look at these tasks ever again 
            this._mostRecentTask.Remove(c);
        }, 
 
//        internal object 
        Run:function(/*object*/ arg)
        { 
            var lastChance = arg;
            var retryHead = lastChance ? null : new Task(null, TaskOps.TransferValue, null);
            var retryTail = retryHead;
 
            // unregister the LayoutUpdated event - we only need to be called once
            if (this._layoutElement != null) 
            { 
            	this._layoutElement.LayoutUpdated -= new EventHandler(OnLayoutUpdated);
            	this._layoutElement = null; 
            }

            if (this.IsShutDown)
                return null; 

            // iterate through the task list 
            var nextTask = null; 
            for (var task = _head.Next;  task != null;  task = nextTask)
            { 
                // sever the back pointer - older tasks are no longer needed
                task.PreviousForClient = null;

                // run pending tasks 
                if (task.status == Task.Status.Pending)
                { 
                    task.Run(lastChance); 

                    // fetch the next task _after_ the current task has 
                    // run (in case the current task causes new tasks to be
                    // added to the list, as in bug 1938866), but _before_
                    // moving the current task to the retry list (which overwrites
                    // the Next pointer) 
                    nextTask = task.Next;
 
                    if (task.status == Task.Status.Retry && !lastChance) 
                    {
                        // the task needs to be retried - add it to the list 
                        task.status = Task.Status.Pending;
                        retryTail.Next = task;
                        retryTail = task;
                        retryTail.Next = null; 
                    }
                } 
                else 
                {
                    nextTask = task.Next; 
                }
            }

            // return the list to its empty state 
            this._head.Next = null;
            this._tail = _head; 
            this._mostRecentTask.Clear(); 

            // repost the tasks that need to be retried 
            if (!lastChance)
            {
                // there is already a dispatcher request to call Run, so change
                // _head temporarily so that AddTask does not make another request 
                var headSave = this._head;
                this._head = null; 
 
                for (var task = retryHead.Next;  task != null;  task = task.Next)
                { 
                	this.AddTask(task.client, task.op);
                }

                this._head = headSave; 
            }
 
            return null; 
        },
 
//        internal ViewRecord 
        GetViewRecord:function(/*object*/ collection, /*CollectionViewSource*/ key, 
        		/*Type*/ collectionViewType, /*bool*/ createView, /*Func<object, object>*/ GetSourceItem)
        {
            if (this.IsShutDown)
                return null; 

            /*ViewRecord*/var record = _viewManager.GetViewRecord(collection, key, collectionViewType, createView, GetSourceItem); 
 
            // lacking any definitive event on which to trigger a cleanup pass,
            // we use a heuristic, namely the creation of a new view.  This suggests 
            // that there is new activity, which often means that old content is
            // being replaced.  So perhaps the view table now has stale entries.
            if (record != null && !record.IsInitialized)
            { 
            	this.ScheduleCleanup();
            } 
 
            return record;
        },

//        internal void 
        RegisterCollectionSynchronizationCallback:function(
                            /*IEnumerable*/ collection,
                            /*object*/ context, 
                            /*CollectionSynchronizationCallback*/ synchronizationCallback)
        { 
        	this._viewManager.RegisterCollectionSynchronizationCallback(collection, context, synchronizationCallback); 
        },
 
        // cache of default converters (so that all uses of string-to-int can
        // share the same converter)
//        internal IValueConverter 
        GetDefaultValueConverter:function(/*Type*/ sourceType,
                                                        /*Type*/ targetType, 
                                                        /*bool*/ targetToSource)
        { 
            /*IValueConverter*/var result = this._valueConverterTable[sourceType, targetType, targetToSource]; 

            if (result == null) 
            {
                result = DefaultValueConverter.Create(sourceType, targetType, targetToSource, this);
                if (result != null)
                	this._valueConverterTable.Add(sourceType, targetType, targetToSource, result); 
            }
 
            return result; 
        },
 
        // make an async request to the scheduler that handles requests for the given target
//        internal void 
        AddAsyncRequest:function(/*DependencyObject*/ target, /*AsyncDataRequest*/ request)
        {
            if (target == null) 
                return;
 
            // get the appropriate scheduler 
            /*IAsyncDataDispatcher*/var asyncDispatcher = this.AsyncDataDispatcher;
 
            // add it to the list of schedulers that need cleanup
            if (this._asyncDispatchers == null) 
            {
            	this._asyncDispatchers = new HybridDictionary(1);    // lazy instantiation
            }
            this._asyncDispatchers[asyncDispatcher] = null;  // the value is unused 

            // make the request 
            asyncDispatcher.AddRequest(request); 
        },
 

        //
        // retrieve the value, using the cache if necessary 
//        internal object 
        GetValue:function(/*object*/ item, /*PropertyDescriptor*/ pd, /*bool*/ indexerIsNext)
        { 
            return this._valueTable.GetValue(item, pd, indexerIsNext);
        },

        // give the value cache first chance at handling property changes 
//        internal void 
        RegisterForCacheChanges:function(/*object*/ item, /*object*/ descriptor)
        { 
            /*PropertyDescriptor*/var pd = descriptor instanceof PropertyDescriptor ? descriptor : null; 
            if (item != null && pd != null && ValueTable.ShouldCache(item, pd))
            { 
                this._valueTable.RegisterForChanges(item, pd, this);
            }
        },
 
        // schedule a cleanup pass.  This can be called from any thread.
//        internal void 
        ScheduleCleanup:function() 
        { 
//            // only the first request after a previous cleanup should schedule real work
//            if (Interlocked.Increment(ref _cleanupRequests) == 1) 
//            {
//                Dispatcher.BeginInvoke(DispatcherPriority.ContextIdle, new DispatcherOperationCallback(CleanupOperation), null);
//            }
        },

        // return true if something was actually cleaned up 
//        internal bool 
        Cleanup:function() 
        {
            var foundDirt = false; 

            if (!IsShutDown)
            {
                foundDirt = this._viewManager.Purge() || foundDirt; 

                foundDirt = WeakEventManager.Cleanup() || foundDirt; 
 
                foundDirt = this._valueTable.Purge() || foundDirt;
 
                foundDirt = this._commitManager.Purge() || foundDirt;
            }

            return foundDirt; 
        },
 
        // Marshal some work from a foreign thread to the UI thread 
        // (e.g. PropertyChanged or CollectionChanged events)
//        internal DataBindOperation 
        Marshal:function(/*DispatcherOperationCallback*/ method, /*object*/ arg, /*int*/ cost/*=1*/) 
        {
//            DataBindOperation op = new DataBindOperation(method, arg, cost);
//            lock (_crossThreadQueueLock)
//            { 
//                _crossThreadQueue.Enqueue(op);
//                _crossThreadCost += cost; 
// 
//                if (_crossThreadDispatcherOperation == null)
//                { 
//                    _crossThreadDispatcherOperation = Dispatcher.BeginInvoke(
//                        DispatcherPriority.ContextIdle,
//                        (Action)ProcessCrossThreadRequests);
//                } 
//            }
// 
//            return op; 
        },
 
//        internal void 
        ChangeCost:function(/*DataBindOperation*/ op, /*int*/ delta)
        {
//            lock (_crossThreadQueueLock)
//            { 
//                op.Cost += delta;
//                _crossThreadCost += delta; 
//            } 
        },
 
//        void 
        ProcessCrossThreadRequests:function()
        {
//            if (IsShutDown)
//                return; 
//
//            long startTime = DateTime.Now.Ticks;        // unit = 10^-7 sec 
// 
//            while (true)
//            { 
//                // get the next request
//                DataBindOperation op;
//                lock (_crossThreadQueueLock)
//                { 
//                    if (_crossThreadQueue.Count > 0)
//                    { 
//                        op =  _crossThreadQueue.Dequeue(); 
//                        _crossThreadCost -= op.Cost;
//                    } 
//                    else
//                    {
//                        op = null;
//                    } 
//                }
// 
//                if (op == null) 
//                    break;
// 
//                // do the work
//                op.Invoke();
//
//                // check the time 
//                if (DateTime.Now.Ticks - startTime > CrossThreadThreshold)
//                    break; 
//            } 
//
//            lock (_crossThreadQueueLock) 
//            {
//                if (_crossThreadQueue.Count > 0)
//                {
//                    // if there's still more work to do, schedule a new callback 
//                    _crossThreadDispatcherOperation = Dispatcher.BeginInvoke(
//                        DispatcherPriority.ContextIdle, 
//                        (Action)ProcessCrossThreadRequests); 
//                }
//                else 
//                {
//                    // otherwise revert to the empty state
//                    _crossThreadDispatcherOperation = null;
//                    _crossThreadCost = 0; 
//                }
//            } 
        },

        //----------------------------------------------------- 
        //
        //  Private Methods
        //
        //----------------------------------------------------- 

//        private void 
        RequestRun:function() 
        { 
//            // Run tasks before layout, to front load as much layout work as possible
//            Dispatcher.BeginInvoke(DispatcherPriority.DataBind, new DispatcherOperationCallback(Run), false); 
//
//            // Run tasks (especially re-tried AttachToContext tasks) again after
//            // layout as the last chance.  Any failures in AttachToContext will
//            // be treated as an error. 
//            Dispatcher.BeginInvoke(DispatcherPriority.Loaded, new DispatcherOperationCallback(Run), true);
        },
 
        // run a cleanup pass
//        private object 
        CleanupOperation:function(/*object*/ arg) 
        {
//            // allow new requests, even if cleanup is disabled
//            Interlocked.Exchange(ref _cleanupRequests, 0);
// 
//            if (!_cleanupEnabled)
//                return null; 
// 
//            Cleanup();
// 
//            return null;
        },

        // do the final cleanup when the Dispatcher or AppDomain is shut down 
//        private void 
        OnShutDown:function()
        { 
            this._viewManager = null; 
            this._commitManager = null;
            this._valueConverterTable = null; 
            this._mostRecentTask = null;
            this._head = _tail = null;
            this._crossThreadQueue.Clear();
 
//            // notify all the async dispatchers we've ever talked to
//            // The InterlockedExchange makes sure we only do this once 
//            // (in case Dispatcher and AppDomain are being shut down simultaneously 
//            // on two different threads)
//            HybridDictionary asyncDispatchers = (HybridDictionary)Interlocked.Exchange(ref _asyncDispatchers, null); 
//            if (asyncDispatchers != null)
//            {
//                foreach (object o in asyncDispatchers.Keys)
//                { 
//                    IAsyncDataDispatcher dispatcher = o as IAsyncDataDispatcher;
//                    if (dispatcher != null) 
//                    { 
//                        dispatcher.CancelAllRequests();
//                    } 
//                }
//            }
//
//            _defaultAsyncDataDispatcher = null; 
//
//            // Note: the engine is still held in TLS.  This maintains the 1-1 relationship 
//            // between the thread and the engine.  However the engine is basically 
//            // dead - _mostRecentTask is null, and most operations are now no-ops or illegal.
//            // This imitates the behavior of the thread's Dispatcher. 
        },

        // A UIElement with pending AttachToContext task(s) has raised the
        // LayoutUpdated event.  Run the task list. 
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            this.Run(false); 
        }
 
	});
	
	Object.defineProperties(DataBindEngine.prototype,{

        //------------------------------------------------------ 
        //
        //  Internal Properties 
        //
        //------------------------------------------------------

//        internal PathParser 
        PathParser: { get:function() { return this._pathParser; } },
//        internal ValueConverterContext 
        ValueConverterContext: { get:function() { return this._valueConverterContext; } },
//        internal AccessorTable 
        AccessorTable: { get:function() { return this._accessorTable; } }, 
//        internal bool 
        IsShutDown: { get:function() { return (this._viewManager == null); } },
        
//        internal bool 
        CleanupEnabled:
        {
            get:function() { return this._cleanupEnabled; },
            set:function(value)
            { 
            	this._cleanupEnabled = value;
                WeakEventManager.SetCleanupEnabled(value); 
            } 
        },
 
//        internal IAsyncDataDispatcher 
        AsyncDataDispatcher:
        {
            get:function()
            { 
                // lazy construction of async dispatcher
                if (this._defaultAsyncDataDispatcher == null) 
                	this._defaultAsyncDataDispatcher = new DefaultAsyncDataDispatcher(); 

                return this._defaultAsyncDataDispatcher; 
            }
        },

//        internal ViewManager 
        ViewManager: { get:function() { return this._viewManager; } },
//        internal CommitManager 
        CommitManager: { get:function() { if (!this._commitManager.IsEmpty) this.ScheduleCleanup(); return this._commitManager; } } 
	});
	
	Object.defineProperties(DataBindEngine, {
		        /// <summary> 
        /// Return the DataBindEngine for the current thread
        /// </summary> 
//        internal static DataBindEngine 
        CurrentDataBindEngine: 
        {
            get:function() 
            {
                // _currentEngine is [ThreadStatic], so there's one per thread
                if (DataBindEngine._currentEngine === undefined)
                { 
                	DataBindEngine._currentEngine = new DataBindEngine();
                } 
 
                return DataBindEngine._currentEngine;
            } 
        }
	});
	
	DataBindEngine.Type = new Type("DataBindEngine", DataBindEngine, [Object.Type]);
	return DataBindEngine;
});


//---------------------------------------------------------------------------- 
//
// <copyright file="DataBindEngine.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright> 
//
// Description: Data binding engine. 
// 
//---------------------------------------------------------------------------
 
using System;
using System.Collections.Generic;   // Dictionary<TKey, TValue>
using System.ComponentModel;
using System.Diagnostics; 
using System.Collections;
using System.Collections.Specialized; 
using System.Globalization; 
using System.Windows.Threading;
using System.Security;              // [SecurityCritical,SecurityTreatAsSafe] 
using System.Threading;

using System.Windows;
using System.Windows.Data; 
using System.Windows.Markup;
using MS.Internal.Data; 
using MS.Internal;          // Invariant.Assert 

namespace MS.Internal.Data 
{
    internal enum TaskOps
    {
        TransferValue, 
        UpdateValue,
        AttachToContext, 
        VerifySourceReference, 
        RaiseTargetUpdatedEvent,
    } 

    internal interface IDataBindEngineClient
    {
        void TransferValue(); 
        void UpdateValue();
        bool AttachToContext(bool lastChance); 
        void VerifySourceReference(bool lastChance); 
        void OnTargetUpdated();
        DependencyObject TargetElement { get; } 
    }

    internal class DataBindEngine : DispatcherObject
    { 
        //-----------------------------------------------------
        // 
        //  Nested classes 
        //
        //----------------------------------------------------- 

        // The task list is represented by a singly linked list of Tasks
        // connected via the Next pointer.  The variables _head and _tail
        // point to the beginning and end of the list.  The head is always 
        // a dummy Task that is never used for anything else - this makes
        // the code for adding to the list simpler. 
        // 
        // In addition, all tasks for a particular client are linked in
        // reverse order of arrival by the PreviousForClient back pointer. 
        // The heads of these lists are kept in the _mostRecentForClient
        // hashtable.  This allows rapid cancellation of all tasks pending
        // for a particular client - we only need to look at the tasks that
        // are actually affected, rather than the entire list.  This avoids 
        // an O(n^2) algorithm (bug 1366032).
 
        private class Task 
        {
            public enum Status { Pending, Running, Completed, Retry, Cancelled }; 
            public IDataBindEngineClient client;
            public TaskOps op;
            public Status status;
            public Task Next; 
            public Task PreviousForClient;
 
            public Task(IDataBindEngineClient c, TaskOps o, Task previousForClient) 
            {
                client = c; 
                op = o;
                PreviousForClient = previousForClient;
                status = Status.Pending;
            } 

            public void Run(bool lastChance) 
            { 
                status = Status.Running;
                Status newStatus = Status.Completed; 
                switch (op)
                {
                    case TaskOps.TransferValue:
                        client.TransferValue(); 
                        break;
 
                    case TaskOps.UpdateValue: 
                        client.UpdateValue();
                        break; 

                    case TaskOps.RaiseTargetUpdatedEvent:
                        client.OnTargetUpdated();
                        break; 

                    case TaskOps.AttachToContext: 
                        bool succeeded = client.AttachToContext(lastChance); 
                        if (!succeeded && !lastChance)
                            newStatus = Status.Retry; 
                        break;

                    case TaskOps.VerifySourceReference:
                        client.VerifySourceReference(lastChance); 
                        break;
                } 
                status = newStatus; 
            }
        } 

        //------------------------------------------------------
        //
        //  Constructors 
        //
        //----------------------------------------------------- 
 
        /// <SecurityNote>
        ///     Critical: This code calls into Link demanded methods to attach handlers 
        ///     TreatAsSafe: This code does not take any parameter or return state.
        ///     It simply attaches private call back.
        /// </SecurityNote>
        [SecurityCritical,SecurityTreatAsSafe] 
        private DataBindEngine()
        { 
            // Set up the final cleanup 
            DataBindEngineShutDownListener listener = new DataBindEngineShutDownListener(this);
 
            // initialize the task list
            _head = new Task(null, TaskOps.TransferValue, null);
            _tail = _head;
            _mostRecentTask = new HybridDictionary(); 
        }
 
        //------------------------------------------------------ 
        //
        //  Internal Properties 
        //
        //------------------------------------------------------

        internal PathParser PathParser { get { return _pathParser; } } 
        internal ValueConverterContext ValueConverterContext { get { return _valueConverterContext; } }
        internal AccessorTable AccessorTable { get { return _accessorTable; } } 
        internal bool IsShutDown { get { return (_viewManager == null); } } 

        internal bool CleanupEnabled 
        {
            get { return _cleanupEnabled; }
            set
            { 
                _cleanupEnabled = value;
                WeakEventManager.SetCleanupEnabled(value); 
            } 
        }
 
        internal IAsyncDataDispatcher AsyncDataDispatcher
        {
            get
            { 
                // lazy construction of async dispatcher
                if (_defaultAsyncDataDispatcher == null) 
                    _defaultAsyncDataDispatcher = new DefaultAsyncDataDispatcher(); 

                return _defaultAsyncDataDispatcher; 
            }
        }

        /// <summary> 
        /// Return the DataBindEngine for the current thread
        /// </summary> 
        internal static DataBindEngine CurrentDataBindEngine 
        {
            get 
            {
                // _currentEngine is [ThreadStatic], so there's one per thread
                if (_currentEngine == null)
                { 
                    _currentEngine = new DataBindEngine();
                } 
 
                return _currentEngine;
            } 
        }

        internal ViewManager ViewManager { get { return _viewManager; } }
        internal CommitManager CommitManager { get { if (!_commitManager.IsEmpty) ScheduleCleanup(); return _commitManager; } } 

 
        //----------------------------------------------------- 
        //
        //  Internal Methods 
        //
        //------------------------------------------------------

        internal void AddTask(IDataBindEngineClient c, TaskOps op) 
        {
            // ignore requests that arrive after shutdown 
            if (_mostRecentTask == null) 
                return;
 
            // if we're adding to an empty list, request that the list be processed
            if (_head == _tail)
            {
                RequestRun(); 
            }
 
            // link a new task into the list 
            Task recentTask = (Task)_mostRecentTask[c];
            Task newTask = new Task(c, op, recentTask); 
            _tail.Next = newTask;
            _tail = newTask;
            _mostRecentTask[c] = newTask;
 
            // if the task is AttachToContext and the target is a UIElement,
            // register for the LayoutUpdated event, and run the task list from the 
            // event handler.  This avoids flashing, at the expense of lots more 
            // events and handlers (bug 1019232)
            if (op == TaskOps.AttachToContext && 
                _layoutElement == null &&
                (_layoutElement = c.TargetElement as UIElement) != null)
            {
                _layoutElement.LayoutUpdated += new EventHandler(OnLayoutUpdated); 
            }
        } 
 
        internal void CancelTask(IDataBindEngineClient c, TaskOps op)
        { 
            // ignore requests that arrive after shutdown
            if (_mostRecentTask == null)
                return;
 
            for (Task task = (Task)_mostRecentTask[c];  task != null;  task = task.PreviousForClient)
            { 
                if (task.op == op && task.status == Task.Status.Pending) 
                {
                    task.status = Task.Status.Cancelled; 
                    break;
                }
            }
        } 

        internal void CancelTasks(IDataBindEngineClient c) 
        { 
            // ignore requests that arrive after shutdown
            if (_mostRecentTask == null) 
                return;

            // cancel pending tasks for the given client
            for (Task task = (Task)_mostRecentTask[c];  task != null;  task = task.PreviousForClient) 
            {
                Invariant.Assert(task.client == c, "task list is corrupt"); 
                if (task.status == Task.Status.Pending) 
                {
                    task.status = Task.Status.Cancelled; 
                }
            }

            // no need to look at these tasks ever again 
            _mostRecentTask.Remove(c);
        } 
 
        internal object Run(object arg)
        { 
            bool lastChance = (bool)arg;
            Task retryHead = lastChance ? null : new Task(null, TaskOps.TransferValue, null);
            Task retryTail = retryHead;
 
            // unregister the LayoutUpdated event - we only need to be called once
            if (_layoutElement != null) 
            { 
                _layoutElement.LayoutUpdated -= new EventHandler(OnLayoutUpdated);
                _layoutElement = null; 
            }

            if (IsShutDown)
                return null; 

            // iterate through the task list 
            Task nextTask = null; 
            for (Task task = _head.Next;  task != null;  task = nextTask)
            { 
                // sever the back pointer - older tasks are no longer needed
                task.PreviousForClient = null;

                // run pending tasks 
                if (task.status == Task.Status.Pending)
                { 
                    task.Run(lastChance); 

                    // fetch the next task _after_ the current task has 
                    // run (in case the current task causes new tasks to be
                    // added to the list, as in bug 1938866), but _before_
                    // moving the current task to the retry list (which overwrites
                    // the Next pointer) 
                    nextTask = task.Next;
 
                    if (task.status == Task.Status.Retry && !lastChance) 
                    {
                        // the task needs to be retried - add it to the list 
                        task.status = Task.Status.Pending;
                        retryTail.Next = task;
                        retryTail = task;
                        retryTail.Next = null; 
                    }
                } 
                else 
                {
                    nextTask = task.Next; 
                }
            }

            // return the list to its empty state 
            _head.Next = null;
            _tail = _head; 
            _mostRecentTask.Clear(); 

            // repost the tasks that need to be retried 
            if (!lastChance)
            {
                // there is already a dispatcher request to call Run, so change
                // _head temporarily so that AddTask does not make another request 
                Task headSave = _head;
                _head = null; 
 
                for (Task task = retryHead.Next;  task != null;  task = task.Next)
                { 
                    AddTask(task.client, task.op);
                }

                _head = headSave; 
            }
 
            return null; 
        }
 
        internal ViewRecord GetViewRecord(object collection, CollectionViewSource key, Type collectionViewType, bool createView, Func<object, object> GetSourceItem)
        {
            if (IsShutDown)
                return null; 

            ViewRecord record = _viewManager.GetViewRecord(collection, key, collectionViewType, createView, GetSourceItem); 
 
            // lacking any definitive event on which to trigger a cleanup pass,
            // we use a heuristic, namely the creation of a new view.  This suggests 
            // that there is new activity, which often means that old content is
            // being replaced.  So perhaps the view table now has stale entries.
            if (record != null && !record.IsInitialized)
            { 
                ScheduleCleanup();
            } 
 
            return record;
        } 

        internal void RegisterCollectionSynchronizationCallback(
                            IEnumerable collection,
                            object context, 
                            CollectionSynchronizationCallback synchronizationCallback)
        { 
            _viewManager.RegisterCollectionSynchronizationCallback(collection, context, synchronizationCallback); 
        }
 
        // cache of default converters (so that all uses of string-to-int can
        // share the same converter)
        internal IValueConverter GetDefaultValueConverter(Type sourceType,
                                                        Type targetType, 
                                                        bool targetToSource)
        { 
            IValueConverter result = _valueConverterTable[sourceType, targetType, targetToSource]; 

            if (result == null) 
            {
                result = DefaultValueConverter.Create(sourceType, targetType, targetToSource, this);
                if (result != null)
                    _valueConverterTable.Add(sourceType, targetType, targetToSource, result); 
            }
 
            return result; 
        }
 
        // make an async request to the scheduler that handles requests for the given target
        internal void AddAsyncRequest(DependencyObject target, AsyncDataRequest request)
        {
            if (target == null) 
                return;
 
            // get the appropriate scheduler 
            IAsyncDataDispatcher asyncDispatcher = AsyncDataDispatcher;
            /* AsyncDataDispatcher property is cut (task 41079) 
            IAsyncDataDispatcher asyncDispatcher = Binding.GetAsyncDataDispatcher(target);
            if (asyncDispatcher == null)
            {
                asyncDispatcher = AsyncDataDispatcher; 
            }
            */ 
 
            // add it to the list of schedulers that need cleanup
            if (_asyncDispatchers == null) 
            {
                _asyncDispatchers = new HybridDictionary(1);    // lazy instantiation
            }
            _asyncDispatchers[asyncDispatcher] = null;  // the value is unused 

            // make the request 
            asyncDispatcher.AddRequest(request); 
        }
 

        //

 

 
        // retrieve the value, using the cache if necessary 
        internal object GetValue(object item, PropertyDescriptor pd, bool indexerIsNext)
        { 
            return _valueTable.GetValue(item, pd, indexerIsNext);
        }

        // give the value cache first chance at handling property changes 
        internal void RegisterForCacheChanges(object item, object descriptor)
        { 
            PropertyDescriptor pd = descriptor as PropertyDescriptor; 
            if (item != null && pd != null && ValueTable.ShouldCache(item, pd))
            { 
                _valueTable.RegisterForChanges(item, pd, this);
            }
        }
 
        // schedule a cleanup pass.  This can be called from any thread.
        internal void ScheduleCleanup() 
        { 
            // only the first request after a previous cleanup should schedule real work
            if (Interlocked.Increment(ref _cleanupRequests) == 1) 
            {
                Dispatcher.BeginInvoke(DispatcherPriority.ContextIdle, new DispatcherOperationCallback(CleanupOperation), null);
            }
        } 

        // return true if something was actually cleaned up 
        internal bool Cleanup() 
        {
            bool foundDirt = false; 

            if (!IsShutDown)
            {
                foundDirt = _viewManager.Purge() || foundDirt; 

                foundDirt = WeakEventManager.Cleanup() || foundDirt; 
 
                foundDirt = _valueTable.Purge() || foundDirt;
 
                foundDirt = _commitManager.Purge() || foundDirt;
            }

            return foundDirt; 
        }
 
        // Marshal some work from a foreign thread to the UI thread 
        // (e.g. PropertyChanged or CollectionChanged events)
        internal DataBindOperation Marshal(DispatcherOperationCallback method, object arg, int cost=1) 
        {
            DataBindOperation op = new DataBindOperation(method, arg, cost);
            lock (_crossThreadQueueLock)
            { 
                _crossThreadQueue.Enqueue(op);
                _crossThreadCost += cost; 
 
                if (_crossThreadDispatcherOperation == null)
                { 
                    _crossThreadDispatcherOperation = Dispatcher.BeginInvoke(
                        DispatcherPriority.ContextIdle,
                        (Action)ProcessCrossThreadRequests);
                } 
            }
 
            return op; 
        }
 
        internal void ChangeCost(DataBindOperation op, int delta)
        {
            lock (_crossThreadQueueLock)
            { 
                op.Cost += delta;
                _crossThreadCost += delta; 
            } 
        }
 
        void ProcessCrossThreadRequests()
        {
            if (IsShutDown)
                return; 

            long startTime = DateTime.Now.Ticks;        // unit = 10^-7 sec 
 
            while (true)
            { 
                // get the next request
                DataBindOperation op;
                lock (_crossThreadQueueLock)
                { 
                    if (_crossThreadQueue.Count > 0)
                    { 
                        op =  _crossThreadQueue.Dequeue(); 
                        _crossThreadCost -= op.Cost;
                    } 
                    else
                    {
                        op = null;
                    } 
                }
 
                if (op == null) 
                    break;
 
                // do the work
                op.Invoke();

                // check the time 
                if (DateTime.Now.Ticks - startTime > CrossThreadThreshold)
                    break; 
            } 

            lock (_crossThreadQueueLock) 
            {
                if (_crossThreadQueue.Count > 0)
                {
                    // if there's still more work to do, schedule a new callback 
                    _crossThreadDispatcherOperation = Dispatcher.BeginInvoke(
                        DispatcherPriority.ContextIdle, 
                        (Action)ProcessCrossThreadRequests); 
                }
                else 
                {
                    // otherwise revert to the empty state
                    _crossThreadDispatcherOperation = null;
                    _crossThreadCost = 0; 
                }
            } 
        } 

        //----------------------------------------------------- 
        //
        //  Private Methods
        //
        //----------------------------------------------------- 

        private void RequestRun() 
        { 
            // Run tasks before layout, to front load as much layout work as possible
            Dispatcher.BeginInvoke(DispatcherPriority.DataBind, new DispatcherOperationCallback(Run), false); 

            // Run tasks (especially re-tried AttachToContext tasks) again after
            // layout as the last chance.  Any failures in AttachToContext will
            // be treated as an error. 
            Dispatcher.BeginInvoke(DispatcherPriority.Loaded, new DispatcherOperationCallback(Run), true);
        } 
 
        // run a cleanup pass
        private object CleanupOperation(object arg) 
        {
            // allow new requests, even if cleanup is disabled
            Interlocked.Exchange(ref _cleanupRequests, 0);
 
            if (!_cleanupEnabled)
                return null; 
 
            Cleanup();
 
            return null;
        }

        // do the final cleanup when the Dispatcher or AppDomain is shut down 
        private void OnShutDown()
        { 
            _viewManager = null; 
            _commitManager = null;
            _valueConverterTable = null; 
            _mostRecentTask = null;
            _head = _tail = null;
            _crossThreadQueue.Clear();
 
            // notify all the async dispatchers we've ever talked to
            // The InterlockedExchange makes sure we only do this once 
            // (in case Dispatcher and AppDomain are being shut down simultaneously 
            // on two different threads)
            HybridDictionary asyncDispatchers = (HybridDictionary)Interlocked.Exchange(ref _asyncDispatchers, null); 
            if (asyncDispatchers != null)
            {
                foreach (object o in asyncDispatchers.Keys)
                { 
                    IAsyncDataDispatcher dispatcher = o as IAsyncDataDispatcher;
                    if (dispatcher != null) 
                    { 
                        dispatcher.CancelAllRequests();
                    } 
                }
            }

            _defaultAsyncDataDispatcher = null; 

            // Note: the engine is still held in TLS.  This maintains the 1-1 relationship 
            // between the thread and the engine.  However the engine is basically 
            // dead - _mostRecentTask is null, and most operations are now no-ops or illegal.
            // This imitates the behavior of the thread's Dispatcher. 
        }

        // A UIElement with pending AttachToContext task(s) has raised the
        // LayoutUpdated event.  Run the task list. 
        private void OnLayoutUpdated(object sender, EventArgs e)
        { 
            Run(false); 
        }
 
        //-----------------------------------------------------
        //
        //  Private Types
        // 
        //------------------------------------------------------
 
        // cache of default value converters (so that all uses of string-to-int can 
        // share the same converter)
        class ValueConverterTable : Hashtable 
        {
            struct Key
            {
                Type _sourceType, _targetType; 
                bool _targetToSource;
 
                public Key(Type sourceType, Type targetType, bool targetToSource) 
                {
                    _sourceType = sourceType; 
                    _targetType = targetType;
                    _targetToSource = targetToSource;
                }
 
                public override int GetHashCode()
                { 
                    return _sourceType.GetHashCode() + _targetType.GetHashCode(); 
                }
 
                public override bool Equals(object o)
                {
                    if (o is Key)
                    { 
                        return (this == (Key)o);
                    } 
                    return false; 
                }
 
                public static bool operator==(Key k1, Key k2)
                {
                    return  k1._sourceType == k2._sourceType &&
                            k1._targetType == k2._targetType && 
                            k1._targetToSource == k2._targetToSource;
                } 
 
                public static bool operator!=(Key k1, Key k2)
                { 
                    return !(k1 == k2);
                }
            }
 
            public IValueConverter this[Type sourceType, Type targetType, bool targetToSource]
            { 
                get 
                {
                    Key key = new Key(sourceType, targetType, targetToSource); 
                    object value = base[key];
                    return (IValueConverter)value;
                }
            } 

            public void Add(Type sourceType, Type targetType, bool targetToSource, IValueConverter value) 
            { 
                base.Add(new Key(sourceType, targetType, targetToSource), value);
            } 
        }

        private sealed class DataBindEngineShutDownListener : ShutDownListener
        { 
            /// <SecurityNote>
            ///     Critical: accesses AppDomain.DomainUnload event 
            ///     TreatAsSafe: This code does not take any parameter or return state. 
            ///                  It simply attaches private callbacks.
            /// </SecurityNote> 
            [SecurityCritical,SecurityTreatAsSafe]
            public DataBindEngineShutDownListener(DataBindEngine target) : base(target)
            {
            } 

            internal override void OnShutDown(object target, object sender, EventArgs e) 
            { 
                DataBindEngine table = (DataBindEngine)target;
                table.OnShutDown(); 
            }
        }

        //----------------------------------------------------- 
        //
        //  Private Fields 
        // 
        //------------------------------------------------------
 
        private HybridDictionary _mostRecentTask;           // client --> Task
        Task                _head;
        Task                _tail;
        private UIElement   _layoutElement; 
        private ViewManager _viewManager = new ViewManager();
        private CommitManager _commitManager = new CommitManager(); 
        private ValueConverterTable _valueConverterTable = new ValueConverterTable(); 
        private PathParser  _pathParser = new PathParser();
        private IAsyncDataDispatcher _defaultAsyncDataDispatcher; 
        private HybridDictionary _asyncDispatchers;
        private ValueConverterContext _valueConverterContext = new ValueConverterContext();

        private bool        _cleanupEnabled = true; 

        private ValueTable  _valueTable = new ValueTable(); 
        private AccessorTable _accessorTable = new AccessorTable(); 
        private int         _cleanupRequests;
 
        private Queue<DataBindOperation> _crossThreadQueue = new Queue<DataBindOperation>();
        private object      _crossThreadQueueLock = new object();
        private int         _crossThreadCost;
        private DispatcherOperation _crossThreadDispatcherOperation; 
        internal const int  CrossThreadThreshold = 50000;   // 50 msec
 
        [ThreadStatic] 
        private static DataBindEngine   _currentEngine; // one engine per thread
    } 

}





