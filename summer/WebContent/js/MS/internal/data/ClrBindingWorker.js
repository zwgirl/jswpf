/**
 * Second Check 12-29
 * ClrBindingWorker
 */

define(["dojo/_base/declare", "system/Type", "internal.data/BindingWorker",
        "windows/PropertyPath", "internal.data/PropertyPathWorker", "internal.data/DrillIn",
        "windows/DependencySource", "data/BindingStatusInternal", "windows/PropertyPathStatus"], 
		function(declare, Type, BindingWorker,
				PropertyPath, PropertyPathWorker, BindingDrillIn,
				DependencySource, BindingStatusInternal, PropertyPathStatus){
	
	var Feature = BindingWorker.Feature;
	var ClrBindingWorker = declare("ClrBindingWorker", BindingWorker, {
		constructor:function(/*BindingExpression*/ b, /*DataBindEngine*/ engine) 
//		: base(b)
        {
            var path = this.ParentBinding.Path; 

            if (this.ParentBinding.XPath != null) 
            { 
                path = this.PrepareXmlBinding(path);
            } 

            if (path == null)
            {
                path = new PropertyPath(String.Empty); 
            }
 
            if (this.ParentBinding.Path == null) 
            {
                this.ParentBinding.UsePath(path); 
            }

            this._pathWorker = new PropertyPathWorker(path, this, this.IsDynamic, engine);
            this._pathWorker.SetTreeContext(this.ParentBindingExpression.TargetElementReference); 
        },
        
//        
        // separate method to avoid loading System.Xml if not needed 
//        PropertyPath 
        PrepareXmlBinding:function(/*PropertyPath*/ path) 
        {
            if (path == null)
            {
                var targetDP = this.TargetProperty; 
                var targetType = targetDP.PropertyType;
                var pathString; 
 
                if (targetType == typeof(Object))
                { 
                    if (targetDP == BindingExpression.NoTargetProperty ||
                        targetDP == Selector.SelectedValueProperty ||
                        targetDP.OwnerType == LiveShapingList/*typeof(LiveShapingList)*/
                        ) 
                    {
                        // these properties want the "value" - i.e. the text of 
                        // the first (and usually only) XmlNode 
                        pathString = "/InnerText";
                    } 
                    else if (targetDP == FrameworkElement.DataContextProperty ||
                              targetDP == CollectionViewSource.SourceProperty)
                    {
                        // these properties want the entire collection 
                        pathString = String.Empty;
                    } 
                    else 
                    {
                        // most object-valued properties want the (current) XmlNode itself 
                        pathString = "/";
                    }
                }
                else if (targetType.IsAssignableFrom(XmlDataCollection.Type/*typeof(XmlDataCollection)*/)) 
                {
                    // these properties want the entire collection 
                    pathString = String.Empty; 
                }
                else 
                {
                    // most other properties want the "value"
                    pathString = "/InnerText";
                } 

                path = new PropertyPath(pathString); 
            } 

            // don't bother to create XmlWorker if we don't even have a valid path 
            if (path.SVI.length > 0)
            {
                // tell Xml Worker if desired result is collection, in order to get optimization
                this.SetValue(Feature.XmlWorker, new XmlBindingWorker(this, path.SVI[0].drillIn == DrillIn.Never)); 
            }
            return path; 
        },
        
//        internal override void 
        AttachDataItem:function() 
        {
            var item; 
 
            if (this.XmlWorker == null)
            { 
                item = this.DataItem;
            }
            else
            { 
            	this.XmlWorker.AttachDataItem();
                item = this.XmlWorker.RawValue(); 
            } 

            this.PW.AttachToRootItem(item); 

            if (this.PW.Length == 0)
            {
                this.ParentBindingExpression.SetupDefaultValueConverter(item.GetType()); 
            }
        },
 
//        internal override void 
        DetachDataItem:function()
        { 
        	this.PW.DetachFromRootItem();
            if (this.XmlWorker != null)
            {
            	this.XmlWorker.DetachDataItem(); 
            }
 
            // cancel any pending async requests.  If it has already completed, 
            // but is now waiting in the dispatcher queue, it will be ignored because
            // we set _pending*Request to null. 
            /*AsyncGetValueRequest*/
            var pendingGetValueRequest =/* (AsyncGetValueRequest)*/this.GetValue(Feature.PendingGetValueRequest, null);
            if (pendingGetValueRequest != null)
            {
                pendingGetValueRequest.Cancel(); 
                this.ClearValue(Feature.PendingGetValueRequest);
            } 
 
            var pendingSetValueRequest = /*(AsyncSetValueRequest)*/this.GetValue(Feature.PendingSetValueRequest, null);
            if (pendingSetValueRequest != null) 
            {
                pendingSetValueRequest.Cancel();
                this.ClearValue(Feature.PendingSetValueRequest);
            } 
        },
 
//        internal override object 
        RawValue:function() 
        {
            var rawValue = this.PW.RawValue(); 
            this.SetStatus(this.PW.Status);

            return rawValue;
        }, 

//        internal override void 
        RefreshValue:function() 
        { 
        	this.PW.RefreshValue();
        }, 
//        internal override void 
        UpdateValue:function(/*object*/ value)
        {
            var k = this.PW.Length - 1; 
            var item = this.PW.GetItem(k);
            if (item == null || item == Type.NullDataItem) 
                return; 

            // if the binding is async, post a request to set the value 
            if (this.ParentBinding.IsAsync && !(this.PW.GetAccessor(k) instanceof DependencyProperty))
            {
            	this.RequestAsyncSetValue(item, value);
                return; 
            }
 
            this.PW.SetValue(item, value); 
        },
 
//        internal override void 
        OnCurrentChanged:function(/*ICollectionView*/ collectionView, /*EventArgs*/ args)
        {
            if (XmlWorker != null)
                XmlWorker.OnCurrentChanged(collectionView, args); 
            this.PW.OnCurrentChanged(collectionView);
        }, 
//        internal override bool 
        UsesDependencyProperty:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        { 
            return this.PW.UsesDependencyProperty(d, dp);
        },

//        internal override void 
        OnSourceInvalidation:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*bool*/ isASubPropertyChange) 
        {
            this.PW.OnDependencyPropertyChanged(d, dp, isASubPropertyChange); 
        }, 
//        internal override bool 
        IsPathCurrent:function() 
        {
            var item = (XmlWorker == null) ? this.DataItem : this.XmlWorker.RawValue();
            return PW.IsPathCurrent(item);
        	return PW.IsPathCurrent(this.DataItem);
        }, 
 
//        internal void 
        CancelPendingTasks:function()
        {
            ParentBindingExpression.CancelPendingTasks();
        }, 
//        internal bool 
        AsyncGet:function(/*object*/ item, /*int*/ level) 
        { 
            if (this.ParentBinding.IsAsync)
            { 
            	this.RequestAsyncGetValue(item, level);
                return true;
            }
            else 
                return false;
        },
 
//        internal void 
        ReplaceCurrentItem:function(/*ICollectionView*/ oldCollectionView, /*ICollectionView*/ newCollectionView)
        { 
            // detach from old view
            if (oldCollectionView != null)
            {
            	//cym comment
//                CurrentChangedEventManager.RemoveHandler(oldCollectionView, this.ParentBindingExpression.OnCurrentChanged); 
            	oldCollectionView.CurrentChanged.Remove(new Delegate(this.ParentBindingExpression, this.ParentBindingExpression.OnCurrentChanged));
                if (this.IsReflective)
                { 
//                    CurrentChangingEventManager.RemoveHandler(oldCollectionView, this.ParentBindingExpression.OnCurrentChanging); 
                	oldCollectionView.Remove(new Delegate(this.ParentBindingExpression, this.ParentBindingExpression.OnCurrentChanging));
                }
            } 

            // attach to new view
            if (newCollectionView != null)
            { 
//                CurrentChangedEventManager.AddHandler(newCollectionView, this.ParentBindingExpression.OnCurrentChanged);
            	newCollectionView.CurrentChanged.Combine(new Delegate(this.ParentBindingExpression, this.ParentBindingExpression.OnCurrentChanged));
                if (this.IsReflective) 
                { 
//                    CurrentChangingEventManager.AddHandler(newCollectionView, this.ParentBindingExpression.OnCurrentChanging);
                	newCollectionView.Combine(new Delegate(this.ParentBindingExpression, this.ParentBindingExpression.OnCurrentChanging));
                } 
            }
        },
//        internal void 
        NewValueAvailable:function(/*bool*/ dependencySourcesChanged, /*bool*/ initialValue, /*bool*/ isASubPropertyChange) 
        {
        	this.SetStatus(this.PW.Status); 
 
            var parent = this.ParentBindingExpression;
 
            // this method is called when the last item in the path is replaced.
            // BindingGroup also wants to know about this.
            var bindingGroup = parent.BindingGroup;
            if (bindingGroup != null) 
            {
                bindingGroup.UpdateTable(parent); 
            } 

            if (dependencySourcesChanged) 
            {
            	this.ReplaceDependencySources();
            }
 
            // if there's a revised value (i.e. not during initialization
            // and shutdown), transfer it. 
            if (!initialValue && this.Status != BindingStatusInternal.AsyncRequestPending) 
            {
                parent.ScheduleTransfer(isASubPropertyChange); 
            }
        },

//        internal void 
        SetupDefaultValueConverter:function(/*Type*/ type) 
        {
        	this.ParentBindingExpression.SetupDefaultValueConverter(type); 
        },
//        internal bool 
        IsValidValue:function(/*object*/ value) 
        {
            return this.TargetProperty.IsValidValue(value);
        },
 
//        internal void 
        OnSourcePropertyChanged:function(/*object*/ o, /*string*/ propName)
        { 
            var level; 

            // ignore changes that don't affect this binding. 
            // This test must come before any marshalling to the right context (bug 892484)
            if (!this.IgnoreSourcePropertyChange && (level = this.PW.LevelForPropertyChange(o, propName)) >= 0)
            {
                // if notification was on the right thread, just do the work (normal case) 
//                if (Dispatcher.Thread == Thread.CurrentThread)
//                { 
                	this.PW.OnPropertyChangedAtLevel(level); 
//                }
//                else 
//                {
//                    // otherwise invoke an operation to do the work on the right context
//                    SetTransferIsPending(true);
// 
//                    if (ParentBindingExpression.TargetWantsCrossThreadNotifications)
//                    { 
//                        LiveShapingItem lsi = TargetElement as LiveShapingItem; 
//                        if (lsi != null)
//                        { 
//                            lsi.OnCrossThreadPropertyChange(TargetProperty);
//                        }
//                    }
// 
//                    Engine.Marshal(
//                        new DispatcherOperationCallback(ScheduleTransferOperation), 
//                        new object[]{o, propName}); 
//                }
            } 
        },

//        internal void 
        OnDataErrorsChanged:function(/*INotifyDataErrorInfo*/ indei, /*string*/ propName)
        { 
//            // if notification was on the right thread, just do the work (normal case)
//            if (Dispatcher.Thread == Thread.CurrentThread) 
//            { 
            	this.ParentBindingExpression.UpdateNotifyDataErrors(indei, propName, DependencyProperty.UnsetValue);
//            } 
//            else if (!ParentBindingExpression.IsDataErrorsChangedPending)
//            {
//                // otherwise invoke an operation to do the work on the right context
//                ParentBindingExpression.IsDataErrorsChangedPending = true; 
//                Engine.Marshal(
//                    (arg) => {  object[] args = (object[])arg; 
//                                ParentBindingExpression.UpdateNotifyDataErrors((INotifyDataErrorInfo)args[0], (string)args[1], DependencyProperty.UnsetValue); 
//                                return null; },
//                    new object[]{indei, propName}); 
//            }
        },

        // called by the child XmlBindingWorker when an xml change is detected 
        // but the identity of raw value has not changed.
//        internal void 
        OnXmlValueChanged:function() 
        { 
            // treat this as a property change at the top level
            var item = this.PW.GetItem(0); 
            this.OnSourcePropertyChanged(item, null);
        },

        // called by the child XmlBindingWorker when there's a new raw value 
//        internal void 
        UseNewXmlItem:function(/*object*/ item)
        { 
        	this.PW.DetachFromRootItem(); 
        	this.PW.AttachToRootItem(item);
            if (this.Status != BindingStatusInternal.AsyncRequestPending) 
            {
            	this.ParentBindingExpression.ScheduleTransfer(false);
            }
        }, 
        // called by the child XmlBindingWorker to get the current "result node" 
//        internal object 
        GetResultNode:function() 
        {
            return this.PW.GetItem(0); 
        },

//        internal DependencyObject 
        CheckTarget:function()
        { 
            // if the target has been GC'd, this will shut down the binding
            return this.TargetElement; 
        },
//        internal void 
        ReportGetValueError:function(/*int*/ k, /*object*/ item, /*Exception*/ ex) 
        {
//            if (TraceData.IsEnabled)
//            {
//                SourceValueInfo svi = PW.GetSourceValueInfo(k); 
//                Type type = PW.GetType(k);
//                string parentName = (k>0)? PW.GetSourceValueInfo(k-1).name : String.Empty; 
//                TraceData.Trace(ParentBindingExpression.TraceLevel, 
//                        TraceData.CannotGetClrRawValue(
//                            svi.propertyName, type.Name, 
//                            parentName, AvTrace.TypeName(item)),
//                        ParentBindingExpression, ex);
//            }
        }, 

//        internal void 
        ReportSetValueError:function(/*int*/ k, /*object*/ item, /*object*/ value, /*Exception*/ ex) 
        { 
//            if (TraceData.IsEnabled)
//            { 
//                SourceValueInfo svi = PW.GetSourceValueInfo(k);
//                Type type = PW.GetType(k);
//                TraceData.Trace(TraceEventType.Error,
//                        TraceData.CannotSetClrRawValue( 
//                            svi.propertyName, type.Name,
//                            AvTrace.TypeName(item), 
//                            AvTrace.ToStringHelper(value), 
//                            AvTrace.TypeName(value)),
//                        ParentBindingExpression, ex); 
//            }
        },

//        internal void 
        ReportRawValueErrors:function(/*int*/ k, /*object*/ item, /*object*/ info) 
        {
//            if (TraceData.IsEnabled) 
//            { 
//                if (item == null)
//                { 
//                    // There is probably no data item; e.g. we've moved currency off of a list.
//                    // the type of the missing item is supposed to be _arySVS[k].info.DeclaringType
//                    // the property we're looking for is named _arySVS[k].name
//                    TraceData.Trace(TraceEventType.Information, TraceData.MissingDataItem, ParentBindingExpression); 
//                }
// 
//                if (info == null) 
//                {
//                    // this no info problem should have been error reported at ReplaceItem already. 
//
//                    // this can happen when parent is Nullable with no value
//                    // check _arySVS[k-1].info.ComponentType
//                    //if (!IsNullableType(_arySVS[k-1].info.ComponentType)) 
//                    TraceData.Trace(TraceEventType.Information, TraceData.MissingInfo, ParentBindingExpression);
//                } 
// 
//                if (item == BindingExpression.NullDataItem)
//                { 
//                    // this is OK, not an error.
//                    // this can happen when detaching bindings.
//                    // this can happen when binding has a Nullable data item with no value
//                    TraceData.Trace(TraceEventType.Information, TraceData.NullDataItem, ParentBindingExpression); 
//                }
//            } 
        },

//        internal void 
        ReportBadXPath:function(/*TraceEventType*/ traceType) 
        {
            var xmlWorker = this.XmlWorker;
            if (xmlWorker != null)
            { 
                xmlWorker.ReportBadXPath(traceType);
            } 
        },

//        void 
        SetStatus:function(/*PropertyPathStatus*/ status) 
        { 
            switch (status)
            { 
                case PropertyPathStatus.Inactive:
                    this.Status = BindingStatusInternal.Inactive;
                    break;
                case PropertyPathStatus.Active: 
                    this.Status = BindingStatusInternal.Active;
                    break; 
                case PropertyPathStatus.PathError: 
                    this.Status = BindingStatusInternal.PathError;
                    break; 
                case PropertyPathStatus.AsyncRequestPending:
                    this.Status = BindingStatusInternal.AsyncRequestPending;
                    break;
            } 
        },
 
//        void 
        ReplaceDependencySources:function() 
        {
            if (!this.ParentBindingExpression.IsDetaching) 
            {
                var size = this.PW.Length;
                if (this.PW.NeedsDirectNotification)
                    ++size; 

                /*WeakDependencySource[]*/var newSources = []; //new DependencySource[size]; 
                var n = 0; 

                if (this.IsDynamic)  
                {
                    for (var k=0; k<this.PW.Length; ++k)
                    {
                    	var dp = this.PW.GetAccessor(k);
                    	dp = dp instanceof DependencyProperty ? dp : null ; 
                        if (dp != null)
                        { 
                            var d = this.PW.GetItem(k);
                            d= d instanceof DependencyObject ? d : null ; 
                            if (d != null)
                                newSources[n++] = new DependencySource(d, dp); 
                        }
                    }

                    if (this.PW.NeedsDirectNotification) 
                    {
                        // subproperty notifications can only arise from Freezables 
                        // (as of today - 11/14/08), so we only need to propagate 
                        // them when the raw value is a Freezable.
                        var d = this.PW.RawValue();
                        d = d instanceof Freezable ? d : null; 
                        if (d != null)
                            newSources[n++] = new WeakDependencySourceDependencySource(d, DependencyObject.DirectDependencyProperty);  //new WeakDependencySource(d, DependencyObject.DirectDependencyProperty);
                    }
                } 

                this.ParentBindingExpression.ChangeWorkerSources(newSources, n); 
            } 
        },
        
//        private object 
        ScheduleTransferOperation:function(/*object*/ arg) 
        {
            var a = /*(object[])*/arg; 
            var o = a[0];
            var propName = /*(string)*/a[1];

            // test level again - things may have changed since the operation was invoked 
            var level = this.PW.LevelForPropertyChange(o, propName);
 
            if (level >= 0) 
            {
                this.PW.OnPropertyChangedAtLevel(level); 
            }
            else
            {
            	this.SetTransferIsPending(false); 
            }
 
            return null; 
        }

	});
	
	Object.defineProperties(ClrBindingWorker.prototype,{

//        internal override Type 
        SourcePropertyType: 
        { 
            get:function()
            { 
                return this.PW.GetType(PW.Length - 1);
            }
        },
 
//        internal override bool 
        IsDBNullValidForUpdate:
        { 
            get:function() 
            {
                return this.PW.IsDBNullValidForUpdate; 
            }
        },

//        internal override object 
        SourceItem:
        {
            get:function() 
            { 
                return this.PW.SourceItem;
            } 
        },

//        internal override string 
        SourcePropertyName:
        { 
            get:function()
            { 
                return this.PW.SourcePropertyName; 
            }
        }, 

        //------------------------------------------------------
        //
        //  Internal Methods 
        //
        //------------------------------------------------------ 
 
//        internal override bool 
        CanUpdate:
        { 
            get:function()
            {
                var ppw = this.PW;
                var k = this.PW.Length - 1; 

                if (k < 0) 
                    return false; 

                var item = ppw.GetItem(k); 
                if (item == null || item == Type.NullDataItem)
                    return false;

                var accessor = ppw.GetAccessor(k); 
                if (accessor == null ||
                    (accessor == DependencyProperty.UnsetValue && this.XmlWorker == null)) 
                    return false; 

                return true; 
            }
        },

//        internal bool 
        TransfersDefaultValue:
        { 
            get:function() { return this.ParentBinding.TransfersDefaultValue; }
        }, 
 
//        internal bool 
        ValidatesOnNotifyDataErrors:
        { 
            get:function() { return this.ParentBindingExpression.ValidatesOnNotifyDataErrors; }
        },
        

        //----------------------------------------------------- 
        //
        //  Private Properties
        //
        //------------------------------------------------------ 

//        PropertyPathWorker 
        PW: { get:function() { return this._pathWorker; } }, 
        
//        XmlBindingWorker 
        XmlWorker: { get:function() { return /*(XmlBindingWorker)*/this.GetValue(BindingWorker.Feature.XmlWorker, null); } } 



	});
	
	//#region Async
	//
//	        void RequestAsyncGetValue(object item, int level)
//	        { 
//	            // get information about the property whose value we want
//	            string name = GetNameFromInfo(PW.GetAccessor(level)); 
//	            Invariant.Assert(name != null, "Async GetValue expects a name"); 
	//
//	            // abandon any previous request 
//	            AsyncGetValueRequest pendingGetValueRequest = (AsyncGetValueRequest)GetValue(Feature.PendingGetValueRequest, null);
//	            if (pendingGetValueRequest != null)
//	            {
//	                pendingGetValueRequest.Cancel(); 
//	            }
	// 
//	            // issue the new request 
//	            pendingGetValueRequest =
//	                new AsyncGetValueRequest(item, name, ParentBinding.AsyncState, 
//	                                DoGetValueCallback, CompleteGetValueCallback,
//	                                this, level);
//	            SetValue(Feature.PendingGetValueRequest, pendingGetValueRequest);
//	            Engine.AddAsyncRequest(TargetElement, pendingGetValueRequest); 
//	        }
//    static object OnGetValueCallback(AsyncDataRequest adr) 
//    {
//        AsyncGetValueRequest request = (AsyncGetValueRequest)adr; 
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];
//        object value = worker.PW.GetValue(request.SourceItem, (int)request.Args[1]);
//        if (value == PropertyPathWorker.IListIndexOutOfRange)
//            throw new ArgumentOutOfRangeException("index"); 
//        return value;
//    } 
//
//    static object OnCompleteGetValueCallback(AsyncDataRequest adr)
//    { 
//        AsyncGetValueRequest request = (AsyncGetValueRequest)adr;
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];
//
//        DataBindEngine engine = worker.Engine; 
//        if (engine != null) // could be null if binding has been detached
//        { 
//            engine.Marshal(CompleteGetValueLocalCallback, request); 
//        }
//
//        return null;
//    }
//
//    static object OnCompleteGetValueOperation(object arg) 
//    {
//        AsyncGetValueRequest request = (AsyncGetValueRequest)arg; 
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
//        worker.CompleteGetValue(request);
//        return null; 
//    }
//
//    void CompleteGetValue(AsyncGetValueRequest request)
//    { 
//        AsyncGetValueRequest pendingGetValueRequest = (AsyncGetValueRequest)GetValue(Feature.PendingGetValueRequest, null);
//        if (pendingGetValueRequest == request) 
//        { 
//            ClearValue(Feature.PendingGetValueRequest);
//            int k = (int)request.Args[1]; 
//
//            switch (request.Status)
//            {
//            case AsyncRequestStatus.Completed: 
//                PW.OnNewValue(k, request.Result);
//                SetStatus(PW.Status); 
//                if (k == PW.Length - 1) 
//                    ParentBindingExpression.TransferValue(request.Result, false);
//                break; 
//
//            case AsyncRequestStatus.Failed:
//                ReportGetValueError(k, request.SourceItem, request.Exception);
//                PW.OnNewValue(k, DependencyProperty.UnsetValue); 
//                break;
//            } 
//        } 
//    }
//
//
//    void RequestAsyncSetValue(object item, object value)
//    {
//        // get information about the property whose value we want 
//        string name = GetNameFromInfo(PW.GetAccessor(PW.Length-1));
//        Invariant.Assert(name != null, "Async SetValue expects a name"); 
//
//        // abandon any previous request
//        AsyncSetValueRequest pendingSetValueRequest = (AsyncSetValueRequest)GetValue(Feature.PendingSetValueRequest, null); 
//        if (pendingSetValueRequest != null)
//        {
//            pendingSetValueRequest.Cancel();
//        } 
//
//        // issue the new request 
//        pendingSetValueRequest = 
//            new AsyncSetValueRequest(item, name, value, ParentBinding.AsyncState,
//                            DoSetValueCallback, CompleteSetValueCallback, 
//                            this);
//        SetValue(Feature.PendingSetValueRequest, pendingSetValueRequest);
//        Engine.AddAsyncRequest(TargetElement, pendingSetValueRequest);
//    } 
//
//    static object OnSetValueCallback(AsyncDataRequest adr) 
//    { 
//        AsyncSetValueRequest request = (AsyncSetValueRequest)adr;
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
//        worker.PW.SetValue(request.TargetItem, request.Value);
//        return null;
//    }
//
//    static object OnCompleteSetValueCallback(AsyncDataRequest adr)
//    { 
//        AsyncSetValueRequest request = (AsyncSetValueRequest)adr; 
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];
//
//        DataBindEngine engine = worker.Engine;
//        if (engine != null) // could be null if binding has been detached
//        {
//            engine.Marshal(CompleteSetValueLocalCallback, request); 
//        }
//
//        return null; 
//    }
//
//    static object OnCompleteSetValueOperation(object arg)
//    {
//        AsyncSetValueRequest request = (AsyncSetValueRequest)arg;
//        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
//        worker.CompleteSetValue(request);
//        return null; 
//    } 
//
//    void CompleteSetValue(AsyncSetValueRequest request) 
//    {
//        AsyncSetValueRequest pendingSetValueRequest = (AsyncSetValueRequest)GetValue(Feature.PendingSetValueRequest, null);
//        if (pendingSetValueRequest == request)
//        { 
//            ClearValue(Feature.PendingSetValueRequest);
//
//            switch (request.Status) 
//            {
//            case AsyncRequestStatus.Completed: 
//                break;
//            case AsyncRequestStatus.Failed:
//                object filteredException = ParentBinding.DoFilterException(ParentBindingExpression, request.Exception);
//                Exception exception = filteredException as Exception; 
//                ValidationError validationError;
//
//                if (exception != null) 
//                {
//                    if (TraceData.IsEnabled) 
//                    {
//                        int k = PW.Length - 1;
//                        object value = request.Value;
//                        ReportSetValueError(k, request.TargetItem, request.Value, exception); 
//                    }
//                } 
//                else if ( (validationError = filteredException as ValidationError) != null ) 
//                {
//                    Validation.MarkInvalid(ParentBindingExpression, validationError); 
//                }
//
//                break;
//            } 
//        }
//    } 
//
//    string GetNameFromInfo(object info)
//    { 
//        MemberInfo mi;
//        PropertyDescriptor pd;
//
//        if ((mi = info as MemberInfo) != null) 
//            return mi.Name;
//
//        if ((pd = info as PropertyDescriptor) != null) 
//            return pd.Name;
//
//        return null;
//    }
//#endregion Async
	
	ClrBindingWorker.Type = new Type("ClrBindingWorker", ClrBindingWorker, [BindingWorker.Type]);
	return ClrBindingWorker;
});
//
//        //------------------------------------------------------
//        // 
//        //  Private Enums, Structs, Constants
//        // 
//        //----------------------------------------------------- 
//
//        static readonly AsyncRequestCallback DoGetValueCallback = new AsyncRequestCallback(OnGetValueCallback); 
//        static readonly AsyncRequestCallback CompleteGetValueCallback = new AsyncRequestCallback(OnCompleteGetValueCallback);
//        static readonly DispatcherOperationCallback CompleteGetValueLocalCallback = new DispatcherOperationCallback(OnCompleteGetValueOperation);
//        static readonly AsyncRequestCallback DoSetValueCallback = new AsyncRequestCallback(OnSetValueCallback);
//        static readonly AsyncRequestCallback CompleteSetValueCallback = new AsyncRequestCallback(OnCompleteSetValueCallback); 
//        static readonly DispatcherOperationCallback CompleteSetValueLocalCallback = new DispatcherOperationCallback(OnCompleteSetValueOperation);
// 
//        //------------------------------------------------------ 
//        //
//        //  Private Fields 
//        //
//        //-----------------------------------------------------
//
//        PropertyPathWorker  _pathWorker; 
//    }
// 
//    internal class WeakDependencySource 
//    {
//        internal WeakDependencySource(DependencyObject item, DependencyProperty dp) 
//        {
//            _item = BindingExpressionBase.CreateReference(item);
//            _dp = dp;
//        } 
//
//        internal WeakDependencySource(WeakReference wr, DependencyProperty dp) 
//        { 
//            _item = wr;
//            _dp = dp; 
//        }
//
//        internal DependencyObject DependencyObject { get { return (DependencyObject)BindingExpressionBase.GetReference(_item); } }
//        internal DependencyProperty DependencyProperty { get { return _dp; } } 
//
//        object _item; 
//        DependencyProperty _dp; 
//    }
//} 



