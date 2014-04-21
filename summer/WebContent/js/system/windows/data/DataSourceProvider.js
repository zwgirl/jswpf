/**
 * DataSourceProvider
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/INotifyPropertyChanged", "componentmodel/ISupportInitialize",
        "system/Delegate", "componentmodel/PropertyChangedEventArgs", "system/EventArgs"], 
		function(declare, Type, INotifyPropertyChanged, ISupportInitialize,
				Delegate, PropertyChangedEventArgs, EventArgs){
	var DataSourceProvider = declare("", INotifyPropertyChanged, {
		constructor:function(){
//	        private bool 
	        this._isInitialLoadEnabled = true; 
//	        private bool 
	        this._initialLoadCalled = false;
//	        private int 
	        this._deferLevel = 0; 
//	        private object 
	        this._data = null; 
//	        private Exception 
	        this._error = null;
		},
		
        /// <summary> 
        /// Start the initial query to the underlying data model.
        /// The result will be returned on the Data property. 
        /// This method is typically called by the binding engine when 
        /// dependent data bindings are activated.
        /// Set IsInitialLoadEnabled = false to prevent or delay the automatic loading of data. 
        /// </summary>
        /// <remarks>
        /// The InitialLoad method can be called multiple times.
        /// The provider is expected to ignore subsequent calls once the provider 
        /// is busy executing the initial query, i.e. the provider shall not restart
        /// an already running query when InitialLoad is called again. 
        /// When the query finishes successfully, any InitialLoad call will still not re-query data. 
        /// The InitialLoad operation is typically asynchronous, a DataChanged event will
        /// be raised when the Data property assumed a new value. 
        /// The application should call Refresh to cause a refresh of data.
        /// </remarks>
//        public void 
        InitialLoad:function()
        { 
            // ignore call if IsInitialLoadEnabled == false or already started initialization
            if (!this.IsInitialLoadEnabled || this._initialLoadCalled) 
                return; 

            this._initialLoadCalled = true; 
            this.BeginQuery();
        },

        /// <summary> 
        /// Initiates a Refresh Operation to the underlying data model.
        /// The result will be returned on the Data property. 
        /// </summary> 
        /// <remarks>
        /// A refresh operation is typically asynchronous, a DataChanged event will 
        /// be raised when the Data property assumed a new value.
        /// If the refresh operation fails, the Data property will be set to null;
        /// the Error property will be set with the error exception.
        /// The app can call Refresh while a previous refresh is still underway. 
        /// Calling Refresh twice will cause the DataChanged event to raise twice.
        /// </remarks> 
//        public void 
        Refresh:function() 
        {
            this._initialLoadCalled = true; 
            this.BeginQuery();
        },
        
        /// <summary>
        /// A concrete data provider will call this method 
        /// to indicate that a query has finished.
        /// </summary> 
        /// <remarks> 
        /// This callback can be called from any thread, this implementation
        /// will marshal back the result to the UI thread 
        /// before setting any of the public properties and before raising any events.
        /// <param name="newData">resulting data from query</param>
        /// </remarks>
//        protected void 
        OnQueryFinished:function(/*object*/ newData) 
        {
             this.OnQueryFinished(newData, null, null, null); 
        },

        /// <summary> 
        /// A concrete data provider will call this method
        /// to indicate that a query has finished.
        /// </summary>
        /// <remarks> 
        /// This callback can be called from any thread, this implementation
        /// will marshal back the result to the UI thread 
        /// before setting any of the public properties and before raising any events. 
        /// <param name="newData">resulting data from query</param>
        /// <param name="error">error that occured while running query; null signals no error</param> 
        /// <param name="completionWork">optional delegate to execute completion work on UI thread, e.g. setting additional properties</param>
        /// <param name="callbackArguments">optional arguments to send as parameter with the completionWork delegate</param>
        /// </remarks>
//        protected virtual void 
        OnQueryFinished:function(/*object*/ newData, /*Exception*/ error, 
                                                /*DispatcherOperationCallback*/ completionWork, /*object*/ callbackArguments)
        { 
        	this.UpdateWithNewResult(error, newData, completionWork, callbackArguments);
        },
 
        /// <summary>
        /// Raises a PropertyChanged event (per <see cref="INotifyPropertyChanged" />).
        /// </summary>
//        protected virtual void 
        OnPropertyChanged:function(/*PropertyChangedEventArgs*/ e) 
        {
            if (this.PropertyChanged != null) 
            { 
                this.PropertyChanged.Invoke(this, e);
            } 
        },

        /// <summary>
        ///     Initialization of this element is about to begin; 
        ///     no implicit Refresh occurs until the matched EndInit is called
        /// </summary> 
//        protected virtual void 
        BeginInit:function() 
        {
            ++this._deferLevel; 
        },

        /// <summary>
        ///     Initialization of this element has completed; 
        ///     this causes a Refresh if no other deferred refresh is outstanding
        /// </summary> 
//        protected virtual void 
        EndInit:function() 
        {
        	this.EndDefer(); 
        },

//        private void 
        EndDefer:function() 
        {
//            Debug.Assert(_deferLevel > 0); 
 
            --this._deferLevel;
 
            if (this._deferLevel == 0)
            {
                this.Refresh();
            } 
        },
 
//        private static object 
        UpdateWithNewResult:function(/*object*/ arg) 
        {
            var args =  arg; 
            /*DataSourceProvider*/var provider =  args[0];
            /*Exception*/var error = args[1];
            var newData = args[2]; 
            /*DispatcherOperationCallback*/var completionWork
                =  args[3]; 
            var callbackArgs = args[4]; 

            provider.UpdateWithNewResult(error, newData, completionWork, callbackArgs); 
            return null;
        },

//        private void 
        UpdateWithNewResult:function(/*Exception*/ error, /*object*/ newData, 
        		/*DispatcherOperationCallback*/ completionWork, /*object*/ callbackArgs) 
        {
            var errorChanged = (this._error != error); 
            this._error = error; 
            if (error != null)
            { 
                newData = null;
                this._initialLoadCalled = false; // allow again InitialLoad after an error
            }
 
            this._data = newData;
 
            if (completionWork != null) 
                completionWork(callbackArgs);
 
            // notify any listeners
            this.OnPropertyChanged(new PropertyChangedEventArgs("Data"));
            if (this.DataChanged != null)
            { 
                this.DataChanged.Invoke(this, EventArgs.Empty);
            } 
            if (errorChanged) 
                this.OnPropertyChanged(new PropertyChangedEventArgs("Error"));
        }
        

	});
	
	Object.defineProperties(DataSourceProvider.prototype,{
	       /// <summary> 
        /// Set IsInitialLoadEnabled = false to prevent or delay the automatic loading of data.
        /// </summary> 
//        public bool 
        IsInitialLoadEnabled:
        { 
            get:function() { return this._isInitialLoadEnabled; },
            set:function(value)
            {
                this._isInitialLoadEnabled = value; 
                this.OnPropertyChanged(new PropertyChangedEventArgs("IsInitialLoadEnabled"));
            } 
        }, 

        /// <summary> 
        /// Get the underlying data object.
        /// This is the resulting data source the data provider
        /// </summary>
//        public object 
        Data:
        { 
            get:function() { return this._data; } 
        },
        
        /// <summary> 
        /// Return the error of the last query operation.
        /// To indicate there was no error, it will return null 
        /// </summary>
//        public Exception 
        Error:
        {
            get:function() { return this._error; } 
        },
        
        /// <summary> 
        /// IsRefreshDeferred returns true if there is still an
        /// outstanding DeferRefresh in use.  To get the best use
        /// out of refresh deferral, derived classes should try
        /// not to call Refresh when IsRefreshDeferred is true. 
        /// </summary>
//        protected bool 
        IsRefreshDeferred: 
        { 
            get:function()
            { 
                return (  (this._deferLevel > 0)
                        || (!this.IsInitialLoadEnabled && !this._initialLoadCalled));
            }
        },
        
        /// <summary>
        /// Raise this event when a new data object becomes available
        /// on the Data property.
        /// </summary> 
//        public event EventHandler 
        DataChanged:
        {
        	get:function(){
        		if(this._DataChanged === undefined){
        			this._DataChanged = new Delegate();
        		}
        		
        		return this._DataChanged;
        	}
        },
        
        /// <summary>
        /// PropertyChanged event (per <see cref="INotifyPropertyChanged" />). 
        /// </summary> 
//        event PropertyChangedEventHandler INotifyPropertyChanged.
        PropertyChanged:
        { 
            get:function(){
            	if(this._PropertyChanged === undefined){
            		this._PropertyChanged = new Delegate();
            	}
            	
            	return this._PropertyChanged;
            }
        }
 
	});
	
	DataSourceProvider.Type = new Type("DataSourceProvider", DataSourceProvider, 
			[INotifyPropertyChanged.Type, ISupportInitialize.Type]);
	return DataSourceProvider;
	
});
//
//
//
// 
// 
//    
// 
//  
// 
//
//
//
//        private class DeferHelper : IDisposable 
//        {
//            public DeferHelper(DataSourceProvider provider) 
//            { 
//                _provider = provider;
//            } 
//
//            public void Dispose()
//            {
//                GC.SuppressFinalize(this); 
//                if (_provider != null)
//                { 
//                    _provider.EndDefer(); 
//                    _provider = null;
//                } 
//            }
//
//            private DataSourceProvider _provider;
//        } 



//        static readonly DispatcherOperationCallback UpdateWithNewResultCallback = new DispatcherOperationCallback(UpdateWithNewResult);

