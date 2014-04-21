/**
 * ObjectDataProvider
 */
//--------------------------------------------------------------------------- 
// Design notes:
// 
// ObjectDataProvider uses Activator.CreateInstance() to instantiate a new
// ObjectInstance and Type.InvokeMember() to call a member on the object.
//
// Another way to write this class is through using ConstructorInfo and 
// MethodInfo, it would allow some nice things like caching the MemberInfo
// and changing it only when the MethodParameters was changed in a 
// significant way. 
// However, it was discovered that Type.GetConstructorInfo() and
// Type.GetMethodInfo() need to know all the types of the parameters for 
// member matching.  This means that any null parameter may foil the match.
//
// By using Activator.CreateInstance() and Type.InvokeMember(), we get to
// take advantage of more of the "magic" that finds the best matched 
// constructor/method with the given parameters.
// 
// Security info: 
//
// ObjectDataProvider will fail (as it should) when it does not have 
// permissions to perform reflection on the given Type or Member.
//---------------------------------------------------------------------------
define(["dojo/_base/declare", "system/Type", "data/DataSourceProvider", "internal.data/ParameterCollection",
        "system/Delegate", "system/EventHandler", "componentmodel/PropertyChangedEventArgs"], 
		function(declare, Type, DataSourceProvider, ParameterCollection,
				Delegate, EventHandler, PropertyChangedEventArgs){
	
//    const string 
    var s_instance = "ObjectInstance"; 
//    const string 
    var s_type = "ObjectType";
//    const string 
    var s_method = "MethodName"; 
    
    var SourceMode = declare("SourceMode", null,{ });
    SourceMode.NoSource = 0;           // can accept assignment to ObjectType or ObjectSource 
    SourceMode.FromType = 1;           // can accept assignment only to ObjectType 
    SourceMode.FromInstance = 2;   // can accept assignment only to ObjectInstance
    
	var ObjectDataProvider = declare("ObjectDataProvider", DataSourceProvider,{
		constructor:function( ){

//	        Type 
	        this._objectType = null;
//	        object 
	        this._objectInstance = null; 
//	        string 
	        this._methodName = null;
//	        DataSourceProvider 
	        this._instanceProvider = null; 
//	        ParameterCollection 
	        this._constructorParameters = null; 
//	        ParameterCollection 
	        _methodParameters = null;
//	        bool 
	        this._isAsynchronous = false; 

//	        SourceMode 
	        this._mode = SourceMode.NoSource;
//	        bool 
	        this._needNewInstance = true;   // set to true when ObjectType or ConstructorParameters change
	        
            this._constructorParameters = new ParameterCollection(new Delegate(this, this.OnParametersChanged));
            this._methodParameters = new ParameterCollection(new Delegate(this, this.OnParametersChanged)); 

            this._sourceDataChangedHandler = new EventHandler(this, this.OnSourceDataChanged);
	 

		},
		
        /// <summary> 
        /// Start instantiating the requested object, either immediately
        /// or on a background thread, see IsAsynchronous.
        /// Called by base class from InitialLoad or Refresh
        /// </summary> 
//        protected override void 
        BeginQuery:function()
        { 
            this.QueryWorker(null);
        },
 
        // if the passed in value was a DataSourceProvider,
        // start listening to the (new) provider, and returns the instance value; 
        // else just return the value.
//        private object 
        TryInstanceProvider:function(/*object*/ value)
        {
            if (this._instanceProvider != null)  // was using provider for source 
            {
                // stop listening to old provider 
            	this._instanceProvider.DataChanged.Remove(new Delegate(this, this._sourceDataChangedHandler)); 
            }
 
            this._instanceProvider = value instanceof DataSourceProvider ? value : null;

            if (this._instanceProvider != null)
            { 
                // start listening to new provider
            	this._instanceProvider.DataChanged.Combine(new Delegate(this, this._sourceDataChangedHandler)); 
                value = this._instanceProvider.Data; 
            }
 
            return value;
        },

        // called from ObjectInstance setter or from source provider data change event handler; 
        // raises property changed event;
        // return true iff ObjectInstance is changed 
//        private bool 
        SetObjectInstance:function(/*object*/ value) 
        {
            if (this._objectInstance == value)
                return false; 

            this._objectInstance = value; 
 
            // set the objectType by looking at the new value
            this.SetObjectType((value != null) ? value.GetType() : null); 

            // raise this change event AFTER both oType and oInstance are updated
            this.OnPropertyChanged(s_instance);
 
            return true;
        },
 
        // raises property changed event;
        // return true iff ObjectType is changed 
//        private bool 
        SetObjectType:function(/*Type*/ newType)
        {
            if (this._objectType != newType)
            { 
            	this._objectType = newType;
            	this.OnPropertyChanged(s_type); 
                return true; 
            }
            return false; 
        },

//        void 
        QueryWorker:function(/*object*/ obj)
        { 
            var      data = null;
            var   e = null; // exception to pass back to main thread 
 
            if (this._mode == SourceMode.NoSource || this._objectType == null) { 
                e = new Error('InvalidOperationException(SR.Get(SRID.ObjectDataProviderHasNoSource)');
            } else { 
            	try{
                    if (this._needNewInstance && (this._mode == SourceMode.FromType)) { 
                    	this._objectInstance = this.CreateObjectInstance(); 
                        // don't try to instantiate again until type/parameters change
                        this._needNewInstance = false; 
                    }

                    // keep going even if there's no ObjectInstance; method might be static.
                    if (String.IsNullOrEmpty(this.MethodName)) { 
                        data = this._objectInstance; 
                    } else  {
                        data = this.InvokeMethodOnInstance();
                    }
            	}catch(ex){
            		e = ex;
            	}
            }
            this.OnQueryFinished(data, e, null, null); 
        },
 
//        object 
        CreateObjectInstance:function() 
        {
        	var  instance = null; 
            try
            { 
                var parameters = []; 
                this._constructorParameters.CopyTo(parameters, 0);
                instance = this._objectType.Constructor.apply(instance, parameters);
//                instance = new this._objectType.Constructor(parameters);
                this.OnPropertyChanged(s_instance);
            }catch (ae){
                throw e; 
            } 

            return instance; 
        },

//        object 
        InvokeMethodOnInstance:function()
        { 
            var  data = null;
            try 
            {
            	var pars = [];
            	this._methodParameters.CopyTo(pars, 0);
            	data = this._objectInstance[this.MethodName].apply(this, pars);
            }catch (ae){
                throw ae;
            }
 
            return data;
        },
 
        // call-back function for the ParameterCollections
//        private void 
        OnParametersChanged:function(/*ParameterCollection*/ sender) 
        {
            // if the ConstructorParameters change, remember to instantiate a new object
            if (sender == this._constructorParameters)
            { 
                this._needNewInstance = true;
            } 

            // Note: ObjectInstance and Data are not updated until Refresh() happens!
            if (!this.IsRefreshDeferred) 
            	this.Refresh();
        },
 
        // handler for DataChanged event of the instance's DataSourceProvider
//        private void 
        OnSourceDataChanged:function(/*object*/ sender, /*EventArgs*/ args) 
        {
            if (this.SetObjectInstance(this._instanceProvider.Data)) 
            {
                // Note: Data is not updated until Refresh() happens! 
                if (! this.IsRefreshDeferred)
                	this.Refresh(); 
            }
        },

        /// <summary> 
        /// Helper to raise a PropertyChanged event  />).
        /// </summary> 
//        private void 
        OnPropertyChanged:function(/*string*/ propertyName) 
        {
        	DataSourceProvider.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName)); 
        }
	});
	
	Object.defineProperties(ObjectDataProvider.prototype,{
	      /// <summary> 
        /// The type to instantiate for use as ObjectInstance. 
        /// This is null when the ObjectDataProvider is uninitialized or explicitly set to null.
        /// If the user makes an assignment to ObjectInstance, ObjectType will return 
        /// the Type of the object (or null if the object is null).
        /// </summary>
        /// <remarks>
        /// Only one of ObjectType or ObjectInstance can be set by the user to a non-null value. 
        /// While refresh is deferred, ObjectInstance and Data will not update until Refresh() is called.
        /// </remarks> 
//        public Type 
        ObjectType: 
        {
            get:function() { return this._objectType; }, 
            set:function(value)
            {
                // User is only allowed to set one of ObjectType or ObjectInstance.
                // To change "mode", the user must null the other property first. 
                if (this._mode == SourceMode.FromInstance)
                    throw new Error('InvalidOperationException(SR.Get(SRID.ObjectDataProviderCanHaveOnlyOneSource)'); 
                this._mode = (value == null) ? SourceMode.NoSource : SourceMode.FromType; 

                this._constructorParameters.SetReadOnly(false); 

                if (this._needNewInstance = this.SetObjectType(value))   // raises property changed event
                {
                    // Note: ObjectInstance and Data are not updated until Refresh() happens! 

                    if (! this.IsRefreshDeferred) 
                    	this.Refresh(); 
                }
            } 
        },

        /// <summary> 
        /// When ObjectType is set to a non-null value, this holds the
        /// instantiated object of the Type specified in ObjectType. 
        /// If ObjectInstance is assigned by the user, ObjectType property will reflect the Type 
        /// of the assigned object.
        /// If a DataSourceProvider is assigned to ObjectInstance, ObjectDataProvider will 
        /// use the Data of the assigned source provider as its effective ObjectInstance.
        /// </summary>
        /// <returns>
        /// The instance of object constructed from ObjectType and ConstructorParameters. -or- 
        /// The DataSourceProvider whose Data is used as ObjectInstance.
        /// </returns> 
        /// <remarks> 
        /// Only one of ObjectType or ObjectInstance can be set by the user to a non-null value.
        /// This property, like the Data property, honors DeferRefresh: after setting the ObjectType, 
        /// ObjectInstance will not be filled until Refresh() happens.
        /// </remarks>
//        public object 
        ObjectInstance:
        { 
            get:function()
            { 
                 return (this._instanceProvider != null) ? this._instanceProvider : this._objectInstance; 
            },
            set:function(value) 
            {
                // User is only allowed to set one of ObjectType or ObjectInstance.
                // To change mode, the user must null the property first.
                if (_mode == SourceMode.FromType) 
                    throw new Error('InvalidOperationException(SR.Get(SRID.ObjectDataProviderCanHaveOnlyOneSource)');
                this._mode = (value == null) ? SourceMode.NoSource : SourceMode.FromInstance; 
 
                if (this.ObjectInstance == value)   // instance or provider has not changed, do nothing
                { 
                    return; 
                }
 
                if (value != null) 
                {
                	this._constructorParameters.SetReadOnly(true); 
                	this._constructorParameters.ClearInternal();
                }
                else
                { 
                	this._constructorParameters.SetReadOnly(false);
                } 
 
                value = this.TryInstanceProvider(value); // returns the real instance
 
                // this also updates ObjectType if necessary:
                if (this.SetObjectInstance(value))   // raises property changed event
                {
                    // Note: Data is not updated until Refresh() happens! 
                    if (! this.IsRefreshDeferred) 
                    	this.Refresh(); 
                }
            } 
        },

        /// <summary> 
        /// The name of the method to call on the specified type.
        /// </summary> 
//        public string 
        MethodName:
        { 
            get:function() { return this._methodName; },
            set:function(value)
            {
            	this._methodName = value; 
            	this.OnPropertyChanged(s_method);
 
                if (!this.IsRefreshDeferred) 
                	this.Refresh();
            } 
        },

        /// <summary>
        /// Parameters to pass to the Constructor 
        /// </summary>
        /// <remarks> 
        /// Changing this collection will implicitly cause this DataProvider to refresh. 
        /// When changing multiple refresh-causing properties, the use of
        /// <seealso cref="DeferRefresh"/> is recommended. 
        /// ConstuctorParameters becomes empty and read-only when
        /// ObjectInstance is assigned a value by the user.
        /// </remarks>
//        public IList 
        ConstructorParameters: 
        {
            get:function() { return this._constructorParameters; } 
        }, 
 
        /// <summary>
        /// Parameters to pass to the Method
        /// </summary>
        /// <remarks> 
        /// Changing this collection will implicitly cause this DataProvider to refresh.
        /// When changing multiple refresh-causing properties, the use of 
        /// <seealso cref="DeferRefresh"/> is recommended. 
        /// </remarks>
//        public IList 
        MethodParameters: 
        {
            get:function() { return this._methodParameters; }
        },
        
//        EventHandler 
        _sourceDataChangedHandler:
        {
        	get:function(){
        		if(this.__sourceDataChangedHandler === undefined){
        			this.__sourceDataChangedHandler = new Delegate();
        		}
        		
        		return this.__sourceDataChangedHandler;
        	}
        }
	});
	
	ObjectDataProvider.Type = new Type("ObjectDataProvider", ObjectDataProvider, [DataSourceProvider.Type]);
	return ObjectDataProvider;
});

//        /// <summary> 
//        /// The type to instantiate for use as ObjectInstance. 
//        /// This is null when the ObjectDataProvider is uninitialized or explicitly set to null.
//        /// If the user makes an assignment to ObjectInstance, ObjectType will return 
//        /// the Type of the object (or null if the object is null).
//        /// </summary>
//        /// <remarks>
//        /// Only one of ObjectType or ObjectInstance can be set by the user to a non-null value. 
//        /// While refresh is deferred, ObjectInstance and Data will not update until Refresh() is called.
//        /// </remarks> 
//        public Type ObjectType 
//        {
//            get { return _objectType; } 
//            set
//            {
//                // User is only allowed to set one of ObjectType or ObjectInstance.
//                // To change "mode", the user must null the other property first. 
//                if (_mode == SourceMode.FromInstance)
//                    throw new InvalidOperationException(SR.Get(SRID.ObjectDataProviderCanHaveOnlyOneSource)); 
//                _mode = (value == null) ? SourceMode.NoSource : SourceMode.FromType; 
//
//                _constructorParameters.SetReadOnly(false); 
//
//                if (_needNewInstance = SetObjectType(value))   // raises property changed event
//                {
//                    // Note: ObjectInstance and Data are not updated until Refresh() happens! 
//
//                    if (! IsRefreshDeferred) 
//                        Refresh(); 
//                }
//            } 
//        }
//
//        /// <summary> 
//        /// When ObjectType is set to a non-null value, this holds the
//        /// instantiated object of the Type specified in ObjectType. 
//        /// If ObjectInstance is assigned by the user, ObjectType property will reflect the Type 
//        /// of the assigned object.
//        /// If a DataSourceProvider is assigned to ObjectInstance, ObjectDataProvider will 
//        /// use the Data of the assigned source provider as its effective ObjectInstance.
//        /// </summary>
//        /// <returns>
//        /// The instance of object constructed from ObjectType and ConstructorParameters. -or- 
//        /// The DataSourceProvider whose Data is used as ObjectInstance.
//        /// </returns> 
//        /// <remarks> 
//        /// Only one of ObjectType or ObjectInstance can be set by the user to a non-null value.
//        /// This property, like the Data property, honors DeferRefresh: after setting the ObjectType, 
//        /// ObjectInstance will not be filled until Refresh() happens.
//        /// </remarks>
//        public object ObjectInstance
//        { 
//            get
//            { 
//                 return (_instanceProvider != null) ? _instanceProvider : _objectInstance; 
//            }
//            set 
//            {
//                // User is only allowed to set one of ObjectType or ObjectInstance.
//                // To change mode, the user must null the property first.
//                if (_mode == SourceMode.FromType) 
//                    throw new InvalidOperationException(SR.Get(SRID.ObjectDataProviderCanHaveOnlyOneSource));
//                _mode = (value == null) ? SourceMode.NoSource : SourceMode.FromInstance; 
// 
//                if (ObjectInstance == value)   // instance or provider has not changed, do nothing
//                { 
//                    // debug-only sanity check, since GetType() isn't that cheap;
//                    // using _objectInstance because we're not trying to check the type of the provider!
//                    Debug.Assert((_objectInstance == null) ? (_objectType == null) : (_objectType == _objectInstance.GetType()));
//                    return; 
//                }
// 
//                if (value != null) 
//                {
//                    _constructorParameters.SetReadOnly(true); 
//                    _constructorParameters.ClearInternal();
//                }
//                else
//                { 
//                    _constructorParameters.SetReadOnly(false);
//                } 
// 
//                value = TryInstanceProvider(value); // returns the real instance
// 
//                // this also updates ObjectType if necessary:
//                if (SetObjectInstance(value))   // raises property changed event
//                {
//                    // Note: Data is not updated until Refresh() happens! 
//
//                    if (! IsRefreshDeferred) 
//                        Refresh(); 
//                }
//            } 
//        }
//
//        /// <summary> 
//        /// The name of the method to call on the specified type.
//        /// </summary> 
//        public string MethodName
//        { 
//            get { return _methodName; }
//            set
//            {
//                _methodName = value; 
//                OnPropertyChanged(s_method);
// 
//                if (!IsRefreshDeferred) 
//                    Refresh();
//            } 
//        }
//
//        /// <summary>
//        /// Parameters to pass to the Constructor 
//        /// </summary>
//        /// <remarks> 
//        /// Changing this collection will implicitly cause this DataProvider to refresh. 
//        /// When changing multiple refresh-causing properties, the use of
//        /// <seealso cref="DeferRefresh"/> is recommended. 
//        /// ConstuctorParameters becomes empty and read-only when
//        /// ObjectInstance is assigned a value by the user.
//        /// </remarks>
//        public IList ConstructorParameters 
//        {
//            get { return _constructorParameters; } 
//        } 
// 
//        /// <summary>
//        /// Parameters to pass to the Method
//        /// </summary>
//        /// <remarks> 
//        /// Changing this collection will implicitly cause this DataProvider to refresh.
//        /// When changing multiple refresh-causing properties, the use of 
//        /// <seealso cref="DeferRefresh"/> is recommended. 
//        /// </remarks>
//        public IList MethodParameters 
//        {
//            get { return _methodParameters; }
//        }
//
//        /// <summary> 
//        /// If true object creation will be performed in a worker 
//        /// thread, otherwise will be done in active context.
//        /// </summary> 
//        public bool IsAsynchronous
//        {
//            get { return _isAsynchronous; } 
//            set { _isAsynchronous = value; OnPropertyChanged(s_async); }
//        } 
//
//        /// <summary> 
//        /// Start instantiating the requested object, either immediately
//        /// or on a background thread, see IsAsynchronous.
//        /// Called by base class from InitialLoad or Refresh
//        /// </summary> 
//        protected override void BeginQuery()
//        { 
//            if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.ProviderQuery)) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.BeginQuery(
//                                        TraceData.Identify(this),
//                                        IsAsynchronous ? "asynchronous" : "synchronous"));
//            } 
//
//            if (IsAsynchronous) 
//            { 
//                ThreadPool.QueueUserWorkItem(new WaitCallback(QueryWorker), null);
//            } 
//            else
//            {
//                QueryWorker(null);
//            } 
//        }
// 
//        // if the passed in value was a DataSourceProvider,
//        // start listening to the (new) provider, and returns the instance value; 
//        // else just return the value.
//        private object TryInstanceProvider(object value)
//        {
//            if (_instanceProvider != null)  // was using provider for source 
//            {
//                // stop listening to old provider 
//                _instanceProvider.DataChanged -= _sourceDataChangedHandler; 
//            }
// 
//            _instanceProvider = value as DataSourceProvider;
//
//            if (_instanceProvider != null)
//            { 
//                // start listening to new provider
//                _instanceProvider.DataChanged += _sourceDataChangedHandler; 
//                value = _instanceProvider.Data; 
//            }
// 
//            return value;
//        }
//
//        // called from ObjectInstance setter or from source provider data change event handler; 
//        // raises property changed event;
//        // return true iff ObjectInstance is changed 
//        private bool SetObjectInstance(object value) 
//        {
//            // In FromType mode, _objectInstance is set in CreateObjectInstance() 
//            Debug.Assert(_mode != SourceMode.FromType);
//
//            if (_objectInstance == value)
//                return false; 
//
//            _objectInstance = value; 
// 
//            // set the objectType by looking at the new value
//            SetObjectType((value != null) ? value.GetType() : null); 
//
//            // raise this change event AFTER both oType and oInstance are updated
//            OnPropertyChanged(s_instance);
// 
//            return true;
//        } 
// 
//        // raises property changed event;
//        // return true iff ObjectType is changed 
//        private bool SetObjectType(Type newType)
//        {
//            if (_objectType != newType)
//            { 
//                _objectType = newType;
//                OnPropertyChanged(s_type); 
//                return true; 
//            }
//            return false; 
//        }
//
//        void QueryWorker(object obj)
//        { 
//            object      data    = null;
//            Exception   e       = null; // exception to pass back to main thread 
// 
//            if (_mode == SourceMode.NoSource || _objectType == null)
//            { 
//                if (TraceData.IsEnabled)
//                    TraceData.Trace(TraceEventType.Error, TraceData.ObjectDataProviderHasNoSource);
//                e = new InvalidOperationException(SR.Get(SRID.ObjectDataProviderHasNoSource));
//            } 
//            else
//            { 
//                Exception exInstantiation = null; 
//                if (_needNewInstance && (_mode == SourceMode.FromType))
//                { 
//                    // check if there are public constructors before trying to instantiate;
//                    // this isn't cheap (and is redundant), but it should be better than throwing an exception.
//                    ConstructorInfo[] ciAry = _objectType.GetConstructors();
//                    if (ciAry.Length != 0) 
//                    {
//                        _objectInstance = CreateObjectInstance(out exInstantiation); 
//                    } 
//                    // don't try to instantiate again until type/parameters change
//                    _needNewInstance = false; 
//                }
//
//                // keep going even if there's no ObjectInstance; method might be static.
// 
//                if (string.IsNullOrEmpty(MethodName))
//                { 
//                    data = _objectInstance; 
//                }
//                else 
//                {
//                    data = InvokeMethodOnInstance(out e);
//
//                    if (e != null && exInstantiation != null) 
//                    {
//                        // if InvokeMethod failed, we prefer to surface the instantiation error, if any. 
//                        // (although this can be confusing if the user wanted to call a static method) 
//                        e = exInstantiation;
//                    } 
//                }
//            }
//
//            if (TraceData.IsExtendedTraceEnabled(this, TraceDataLevel.ProviderQuery)) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.QueryFinished( 
//                                        TraceData.Identify(this),
//                                        Dispatcher.CheckAccess() ? "synchronous" : "asynchronous", 
//                                        TraceData.Identify(data),
//                                        TraceData.IdentifyException(e)));
//            }
//            OnQueryFinished(data, e, null, null); 
//        }
// 
//        object CreateObjectInstance(out Exception e) 
//        {
//            object  instance = null; 
//            string  error   = null; // string that describes known error
//            e = null;
// 
//            try
//            { 
//                object[] parameters = new object[_constructorParameters.Count]; 
//                _constructorParameters.CopyTo(parameters, 0);
//                instance = Activator.CreateInstance(_objectType, 0, null, parameters, 
//                                System.Globalization.CultureInfo.InvariantCulture);
//                OnPropertyChanged(s_instance);
//            }
//            catch (ArgumentException ae) 
//            {
//                // this may fire when trying to create Context Affinity objects 
//                error = "Cannot create Context Affinity object."; 
//                e = ae;
//            } 
//
//            if (e != null || error != null) 
//            { 
//                // report known errors through TraceData (instead of throwing exceptions)
//                if (TraceData.IsEnabled) 
//                    TraceData.Trace(TraceEventType.Error, TraceData.ObjDPCreateFailed, _objectType.Name, error, e);
//
//                // in async mode we pass all exceptions to main thread;
//                // in [....] mode we don't handle unknown exceptions. 
//                if (!IsAsynchronous && error == null)
//                    throw e; 
//            } 
//
//            return instance; 
//        }
//
//        object InvokeMethodOnInstance(out Exception e)
//        { 
//            object  data = null;
//            string  error   = null; // string that describes known error 
//            e = null; 
//
//            Debug.Assert(_objectType != null); 
//
//            object[] parameters = new object[_methodParameters.Count];
//            _methodParameters.CopyTo(parameters, 0);
//
//            try 
//            {
//                data = _objectType.InvokeMember(MethodName, 
//                    s_invokeMethodFlags, null, _objectInstance, parameters, 
//                    System.Globalization.CultureInfo.InvariantCulture);
//            } 
//            catch (ArgumentException ae)
//            {
//                error = "Parameter array contains a string that is a null reference.";
//                e = ae; 
//            }
//
//            if (e != null || error != null)
//            {
//                // report known errors through TraceData (instead of throwing exceptions) 
//                if (TraceData.IsEnabled)
//                    TraceData.Trace(TraceEventType.Error, TraceData.ObjDPInvokeFailed, MethodName, _objectType.Name, error, e); 
// 
//                // in async mode we pass all exceptions to main thread;
//                // in [....] mode we don't handle unknown exceptions. 
//                if (!IsAsynchronous && error == null)
//                    throw e;
//            }
// 
//            return data;
//        } 
// 
//        // call-back function for the ParameterCollections
//        private void OnParametersChanged(ParameterCollection sender) 
//        {
//            // if the ConstructorParameters change, remember to instantiate a new object
//            if (sender == _constructorParameters)
//            { 
//                // sanity check: we shouldn't have ctor param changes in FromInstance mode
//                Invariant.Assert (_mode != SourceMode.FromInstance); 
// 
//                _needNewInstance = true;
//            } 
//
//            // Note: ObjectInstance and Data are not updated until Refresh() happens!
//
//            if (!IsRefreshDeferred) 
//                Refresh();
//        } 
// 
//        // handler for DataChanged event of the instance's DataSourceProvider
//        private void OnSourceDataChanged(object sender, EventArgs args) 
//        {
//            Invariant.Assert(sender == _instanceProvider);
//
//            if (SetObjectInstance(_instanceProvider.Data)) 
//            {
//                // Note: Data is not updated until Refresh() happens! 
// 
//                if (! IsRefreshDeferred)
//                    Refresh(); 
//            }
//        }
//
//        /// <summary> 
//        /// Helper to raise a PropertyChanged event  />).
//        /// </summary> 
//        private void OnPropertyChanged(string propertyName) 
//        {
//            OnPropertyChanged(new PropertyChangedEventArgs(propertyName)); 
//        }
//
//        private enum SourceMode 
//        {
//            NoSource,           // can accept assignment to ObjectType or ObjectSource 
//            FromType,           // can accept assignment only to ObjectType 
//            FromInstance,   // can accept assignment only to ObjectInstance
//        } 
//
//        Type _objectType;
//        object _objectInstance; 
//        string _methodName;
//        DataSourceProvider _instanceProvider; 
//        ParameterCollection _constructorParameters; 
//        ParameterCollection _methodParameters;
//        bool _isAsynchronous = false; 
//
//        SourceMode _mode = SourceMode.NoSource;
//        bool _needNewInstance = true;   // set to true when ObjectType or ConstructorParameters change
// 
//        EventHandler _sourceDataChangedHandler;
// 
//        const string s_instance = "ObjectInstance"; 
//        const string s_type = "ObjectType";
//        const string s_method = "MethodName"; 
//        const string s_async = "IsAsynchronous";
//        const BindingFlags s_invokeMethodFlags =
//                            BindingFlags.Public |
//                            BindingFlags.Instance | 
//                            BindingFlags.Static |
//                            BindingFlags.InvokeMethod | 
//                            BindingFlags.FlattenHierarchy | 
//                            BindingFlags.OptionalParamBinding;
 

