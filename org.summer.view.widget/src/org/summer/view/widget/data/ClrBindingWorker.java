package org.summer.view.widget.data;

import org.summer.view.widget.CollectionViewSource;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.PropertyPathStatus;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.controls.Validation;
import org.summer.view.widget.controls.ValidationError;
import org.summer.view.widget.controls.primitives.Selector;
import org.summer.view.widget.internal.LiveShapingItem;
import org.summer.view.widget.internal.XmlBindingWorker;
import org.summer.view.widget.model.CurrentChangedEventManager;
import org.summer.view.widget.model.CurrentChangingEventManager;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.INotifyDataErrorInfo;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;

public class ClrBindingWorker extends BindingWorker
{ 
    //-----------------------------------------------------
    // 
    //  Constructors 
    //
    //----------------------------------------------------- 

    protected ClrBindingWorker(BindingExpression b, DataBindEngine engine) 
    {
    	super(b);
        PropertyPath path = ParentBinding.Path; 

        if (ParentBinding.XPath != null) 
        { 
            path = PrepareXmlBinding(path);
        } 

        if (path == null)
        {
            path = new PropertyPath(String.Empty); 
        }

        if (ParentBinding.Path == null) 
        {
            ParentBinding.UsePath(path); 
        }

        _pathWorker = new PropertyPathWorker(path, this, IsDynamic, engine);
        _pathWorker.SetTreeContext(ParentBindingExpression.TargetElementReference); 
    }

    // separate method to avoid loading System.Xml if not needed 
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
    PropertyPath PrepareXmlBinding(PropertyPath path) 
    {
        if (path == null)
        {
            DependencyProperty targetDP = TargetProperty; 
            Type targetType = targetDP.PropertyType;
            String pathString; 

            if (targetType == typeof(Object))
            { 
                if (targetDP == /*System.Windows.Data.*/BindingExpression.NoTargetProperty ||
                    targetDP == /*System.Windows.Controls.Primitives.*/Selector.SelectedValueProperty ||
                    targetDP.OwnerType == typeof(LiveShapingList)
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
                    // most Object-valued properties want the (current) XmlNode itself 
                    pathString = "/";
                }
            }
            else if (targetType.IsAssignableFrom(typeof(XmlDataCollection))) 
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
            SetValue(Feature.XmlWorker, new XmlBindingWorker(this, path.SVI[0].drillIn == DrillIn.Never)); 
        }
        return path; 
    } 

    //------------------------------------------------------ 
    //
    //  protected Properties
    //
    //----------------------------------------------------- 

    protected Type SourcePropertyType 
    { 
        get
        { 
            return PW.GetType(PW.Length - 1);
        }
    }

    protected boolean IsDBNullValidForUpdate
    { 
        get 
        {
            return PW.IsDBNullValidForUpdate; 
        }
    }

    protected Object SourceItem 
    {
        get 
        { 
            return PW.SourceItem;
        } 
    }

    protected String SourcePropertyName
    { 
        get
        { 
            return PW.SourcePropertyName; 
        }
    } 

    //------------------------------------------------------
    //
    //  protected Methods 
    //
    //------------------------------------------------------ 

    protected boolean CanUpdate
    { 
        get
        {
            PropertyPathWorker ppw = PW;
            int k = PW.Length - 1; 

            if (k < 0) 
                return false; 

            Object item = ppw.GetItem(k); 
            if (item == null || item == BindingExpression.NullDataItem)
                return false;

            Object accessor = ppw.GetAccessor(k); 
            if (accessor == null ||
                (accessor == DependencyProperty.UnsetValue && XmlWorker == null)) 
                return false; 

            return true; 
        }
    }

    public void AttachDataItem() 
    {
        Object item; 

        if (XmlWorker == null)
        { 
            item = DataItem;
        }
        else
        { 
            XmlWorker.AttachDataItem();
            item = XmlWorker.RawValue(); 
        } 

        PW.AttachToRootItem(item); 

        if (PW.Length == 0)
        {
            ParentBindingExpression.SetupDefaultValueConverter(item.GetType()); 
        }
    } 

    public void DetachDataItem()
    { 
        PW.DetachFromRootItem();
        if (XmlWorker != null)
        {
            XmlWorker.DetachDataItem(); 
        }

        // cancel any pending async requests.  If it has already completed, 
        // but is now waiting in the dispatcher queue, it will be ignored because
        // we set _pending*Request to null. 
        AsyncGetValueRequest pendingGetValueRequest = (AsyncGetValueRequest)GetValue(Feature.PendingGetValueRequest, null);
        if (pendingGetValueRequest != null)
        {
            pendingGetValueRequest.Cancel(); 
            ClearValue(Feature.PendingGetValueRequest);
        } 

        AsyncSetValueRequest pendingSetValueRequest = (AsyncSetValueRequest)GetValue(Feature.PendingSetValueRequest, null);
        if (pendingSetValueRequest != null) 
        {
            pendingSetValueRequest.Cancel();
            ClearValue(Feature.PendingSetValueRequest);
        } 
    }

    public Object RawValue() 
    {
        Object rawValue = PW.RawValue(); 
        SetStatus(PW.Status);

        return rawValue;
    } 

    public void RefreshValue() 
    { 
        PW.RefreshValue();
    } 

    public void UpdateValue(Object value)
    {
        int k = PW.Length - 1; 
        Object item = PW.GetItem(k);
        if (item == null || item == BindingExpression.NullDataItem) 
            return; 

        // if the binding is async, post a request to set the value 
        if (ParentBinding.IsAsync && !(PW.GetAccessor(k) is DependencyProperty))
        {
            RequestAsyncSetValue(item, value);
            return; 
        }

        PW.SetValue(item, value); 
    }

    public void OnCurrentChanged(ICollectionView collectionView, EventArgs args)
    {
        if (XmlWorker != null)
            XmlWorker.OnCurrentChanged(collectionView, args); 
        PW.OnCurrentChanged(collectionView);
    } 

    public boolean UsesDependencyProperty(DependencyObject d, DependencyProperty dp)
    { 
        return PW.UsesDependencyProperty(d, dp);
    }

    public void OnSourceInvalidation(DependencyObject d, DependencyProperty dp, boolean isASubPropertyChange) 
    {
        PW.OnDependencyPropertyChanged(d, dp, isASubPropertyChange); 
    } 

    public boolean IsPathCurrent() 
    {
        Object item = (XmlWorker == null) ? DataItem : XmlWorker.RawValue();
        return PW.IsPathCurrent(item);
    } 

    //----------------------------------------------------- 
    // 
    //  protected Properties - callbacks from PropertyPathWorker
    // 
    //------------------------------------------------------

    protected boolean TransfersDefaultValue
    { 
        get { return ParentBinding.TransfersDefaultValue; }
    } 

    protected boolean ValidatesOnNotifyDataErrors
    { 
        get { return ParentBindingExpression.ValidatesOnNotifyDataErrors; }
    }

    //----------------------------------------------------- 
    //
    //  protected Methods - callbacks from PropertyPathWorker 
    // 
    //-----------------------------------------------------

    protected void CancelPendingTasks()
    {
        ParentBindingExpression.CancelPendingTasks();
    } 

    protected boolean AsyncGet(Object item, int level) 
    { 
        if (ParentBinding.IsAsync)
        { 
            RequestAsyncGetValue(item, level);
            return true;
        }
        else 
            return false;
    } 

    protected void ReplaceCurrentItem(ICollectionView oldCollectionView, ICollectionView newCollectionView)
    { 
        // detach from old view
        if (oldCollectionView != null)
        {
            CurrentChangedEventManager.RemoveHandler(oldCollectionView, ParentBindingExpression.OnCurrentChanged); 
            if (IsReflective)
            { 
                CurrentChangingEventManager.RemoveHandler(oldCollectionView, ParentBindingExpression.OnCurrentChanging); 
            }
        } 

        // attach to new view
        if (newCollectionView != null)
        { 
            CurrentChangedEventManager.AddHandler(newCollectionView, ParentBindingExpression.OnCurrentChanged);
            if (IsReflective) 
            { 
                CurrentChangingEventManager.AddHandler(newCollectionView, ParentBindingExpression.OnCurrentChanging);
            } 
        }
    }

    protected void NewValueAvailable(boolean dependencySourcesChanged, boolean initialValue, boolean isASubPropertyChange) 
    {
        SetStatus(PW.Status); 

        BindingExpression parent = ParentBindingExpression;

        // this method is called when the last item in the path is replaced.
        // BindingGroup also wants to know about this.
        BindingGroup bindingGroup = parent.BindingGroup;
        if (bindingGroup != null) 
        {
            bindingGroup.UpdateTable(parent); 
        } 

        if (dependencySourcesChanged) 
        {
            ReplaceDependencySources();
        }

        // if there's a revised value (i.e. not during initialization
        // and shutdown), transfer it. 
        if (!initialValue && Status != BindingStatusInternal.AsyncRequestPending) 
        {
            parent.ScheduleTransfer(isASubPropertyChange); 
        }
    }

    protected void SetupDefaultValueConverter(Type type) 
    {
        ParentBindingExpression.SetupDefaultValueConverter(type); 
    } 

    protected boolean IsValidValue(Object value) 
    {
        return TargetProperty.IsValidValue(value);
    }

    protected void OnSourcePropertyChanged(Object o, String propName)
    { 
        int level; 

        // ignore changes that don't affect this binding. 
        // This test must come before any marshalling to the right context (bug 892484)
        if (!IgnoreSourcePropertyChange && (level = PW.LevelForPropertyChange(o, propName)) >= 0)
        {
            // if notification was on the right thread, just do the work (normal case) 
            if (Dispatcher.Thread == Thread.CurrentThread)
            { 
                PW.OnPropertyChangedAtLevel(level); 
            }
            else 
            {
                // otherwise invoke an operation to do the work on the right context
                SetTransferIsPending(true);

                if (ParentBindingExpression.TargetWantsCrossThreadNotifications)
                { 
                    LiveShapingItem lsi = TargetElement as LiveShapingItem; 
                    if (lsi != null)
                    { 
                        lsi.OnCrossThreadPropertyChange(TargetProperty);
                    }
                }

                Engine.Marshal(
                    new DispatcherOperationCallback(ScheduleTransferOperation), 
                    new Object[]{o, propName}); 
            }
        } 
    }

    protected void OnDataErrorsChanged(INotifyDataErrorInfo indei, String propName)
    { 
        // if notification was on the right thread, just do the work (normal case)
        if (Dispatcher.Thread == Thread.CurrentThread) 
        { 
            ParentBindingExpression.UpdateNotifyDataErrors(indei, propName, DependencyProperty.UnsetValue);
        } 
        else if (!ParentBindingExpression.IsDataErrorsChangedPending)
        {
            // otherwise invoke an operation to do the work on the right context
            ParentBindingExpression.IsDataErrorsChangedPending = true; 
            Engine.Marshal(
                (arg) => {  Object[] args = (Object[])arg; 
                            ParentBindingExpression.UpdateNotifyDataErrors((INotifyDataErrorInfo)args[0], (String)args[1], DependencyProperty.UnsetValue); 
                            return null; },
                new Object[]{indei, propName}); 
        }
    }

    // called by the child XmlBindingWorker when an xml change is detected 
    // but the identity of raw value has not changed.
    protected void OnXmlValueChanged() 
    { 
        // treat this as a property change at the top level
        Object item = PW.GetItem(0); 
        OnSourcePropertyChanged(item, null);
    }

    // called by the child XmlBindingWorker when there's a new raw value 
    protected void UseNewXmlItem(Object item)
    { 
        PW.DetachFromRootItem(); 
        PW.AttachToRootItem(item);
        if (Status != BindingStatusInternal.AsyncRequestPending) 
        {
            ParentBindingExpression.ScheduleTransfer(false);
        }
    } 

    // called by the child XmlBindingWorker to get the current "result node" 
    protected Object GetResultNode() 
    {
        return PW.GetItem(0); 
    }

    protected DependencyObject CheckTarget()
    { 
        // if the target has been GC'd, this will shut down the binding
        return TargetElement; 
    } 

    protected void ReportGetValueError(int k, Object item, Exception ex) 
    {
//        if (TraceData.IsEnabled)
//        {
//            SourceValueInfo svi = PW.GetSourceValueInfo(k); 
//            Type type = PW.GetType(k);
//            String parentName = (k>0)? PW.GetSourceValueInfo(k-1).name : String.Empty; 
//            TraceData.Trace(ParentBindingExpression.TraceLevel, 
//                    TraceData.CannotGetClrRawValue(
//                        svi.propertyName, type.Name, 
//                        parentName, AvTrace.TypeName(item)),
//                    ParentBindingExpression, ex);
//        }
    } 

    protected void ReportSetValueError(int k, Object item, Object value, Exception ex) 
    { 
//        if (TraceData.IsEnabled)
//        { 
//            SourceValueInfo svi = PW.GetSourceValueInfo(k);
//            Type type = PW.GetType(k);
//            TraceData.Trace(TraceEventType.Error,
//                    TraceData.CannotSetClrRawValue( 
//                        svi.propertyName, type.Name,
//                        AvTrace.TypeName(item), 
//                        AvTrace.ToStringHelper(value), 
//                        AvTrace.TypeName(value)),
//                    ParentBindingExpression, ex); 
//        }
    }

    protected void ReportRawValueErrors(int k, Object item, Object info) 
    {
//        if (TraceData.IsEnabled) 
//        { 
//            if (item == null)
//            { 
//                // There is probably no data item; e.g. we've moved currency off of a list.
//                // the type of the missing item is supposed to be _arySVS[k].info.DeclaringType
//                // the property we're looking for is named _arySVS[k].name
//                TraceData.Trace(TraceEventType.Information, TraceData.MissingDataItem, ParentBindingExpression); 
//            }
//
//            if (info == null) 
//            {
//                // this no info problem should have been error reported at ReplaceItem already. 
//
//                // this can happen when parent is Nullable with no value
//                // check _arySVS[k-1].info.ComponentType
//                //if (!IsNullableType(_arySVS[k-1].info.ComponentType)) 
//                TraceData.Trace(TraceEventType.Information, TraceData.MissingInfo, ParentBindingExpression);
//            } 
//
//            if (item == BindingExpression.NullDataItem)
//            { 
//                // this is OK, not an error.
//                // this can happen when detaching bindings.
//                // this can happen when binding has a Nullable data item with no value
//                TraceData.Trace(TraceEventType.Information, TraceData.NullDataItem, ParentBindingExpression); 
//            }
//        } 
    } 

    protected void ReportBadXPath(TraceEventType traceType) 
    {
        XmlBindingWorker xmlWorker = ;
        if (xmlWorker != null)
        { 
            xmlWorker.ReportBadXPath(traceType);
        } 
    } 

    //----------------------------------------------------- 
    //
    //  Private Properties
    //
    //------------------------------------------------------ 

    PropertyPathWorker PW { get { return _pathWorker; } } 
    XmlBindingWorker XmlWorker { get { return (XmlBindingWorker)GetValue(Feature.XmlWorker, null); } } 

    //----------------------------------------------------- 
    //
    //  Private Methods
    //
    //------------------------------------------------------ 

    void SetStatus(PropertyPathStatus status) 
    { 
        switch (status)
        { 
            case /*PropertyPathStatus.*/Inactive:
                Status = BindingStatusInternal.Inactive;
                break;
            case /*PropertyPathStatus.*/Active: 
                Status = BindingStatusInternal.Active;
                break; 
            case /*PropertyPathStatus.*/PathError: 
                Status = BindingStatusInternal.PathError;
                break; 
            case /*PropertyPathStatus.*/AsyncRequestPending:
                Status = BindingStatusInternal.AsyncRequestPending;
                break;
        } 
    }

    void ReplaceDependencySources() 
    {
        if (!ParentBindingExpression.IsDetaching) 
        {
            int size = PW.Length;
            if (PW.NeedsDirectNotification)
                ++size; 

            WeakDependencySource[] newSources = new WeakDependencySource[size]; 
            int n = 0; 

            if (IsDynamic) 
            {
                for (int k=0; k<PW.Length; ++k)
                {
                    DependencyProperty dp = PW.GetAccessor(k) as DependencyProperty; 
                    if (dp != null)
                    { 
                        DependencyObject d = PW.GetItem(k) as DependencyObject; 
                        if (d != null)
                            newSources[n++] = new WeakDependencySource(d, dp); 
                    }
                }

                if (PW.NeedsDirectNotification) 
                {
                    // subproperty notifications can only arise from Freezables 
                    // (as of today - 11/14/08), so we only need to propagate 
                    // them when the raw value is a Freezable.
                    DependencyObject d = PW.RawValue() as Freezable; 
                    if (d != null)
                        newSources[n++] = new WeakDependencySource(d, DependencyObject.DirectDependencyProperty);
                }
            } 

            ParentBindingExpression.ChangeWorkerSources(newSources, n); 
        } 
    }

//#region Async

    void RequestAsyncGetValue(Object item, int level)
    { 
        // get information about the property whose value we want
        String name = GetNameFromInfo(PW.GetAccessor(level)); 
//        Invariant.Assert(name != null, "Async GetValue expects a name"); 

        // abandon any previous request 
        AsyncGetValueRequest pendingGetValueRequest = (AsyncGetValueRequest)GetValue(Feature.PendingGetValueRequest, null);
        if (pendingGetValueRequest != null)
        {
            pendingGetValueRequest.Cancel(); 
        }

        // issue the new request 
        pendingGetValueRequest =
            new AsyncGetValueRequest(item, name, ParentBinding.AsyncState, 
                            DoGetValueCallback, CompleteGetValueCallback,
                            this, level);
        SetValue(Feature.PendingGetValueRequest, pendingGetValueRequest);
        Engine.AddAsyncRequest(TargetElement, pendingGetValueRequest); 
    }

    static Object OnGetValueCallback(AsyncDataRequest adr) 
    {
        AsyncGetValueRequest request = (AsyncGetValueRequest)adr; 
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];
        Object value = worker.PW.GetValue(request.SourceItem, (int)request.Args[1]);
        if (value == PropertyPathWorker.IListIndexOutOfRange)
            throw new ArgumentOutOfRangeException("index"); 
        return value;
    } 

    static Object OnCompleteGetValueCallback(AsyncDataRequest adr)
    { 
        AsyncGetValueRequest request = (AsyncGetValueRequest)adr;
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];

        DataBindEngine engine = worker.Engine; 
        if (engine != null) // could be null if binding has been detached
        { 
            engine.Marshal(CompleteGetValueLocalCallback, request); 
        }

        return null;
    }

    static Object OnCompleteGetValueOperation(Object arg) 
    {
        AsyncGetValueRequest request = (AsyncGetValueRequest)arg; 
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
        worker.CompleteGetValue(request);
        return null; 
    }

    void CompleteGetValue(AsyncGetValueRequest request)
    { 
        AsyncGetValueRequest pendingGetValueRequest = (AsyncGetValueRequest)GetValue(Feature.PendingGetValueRequest, null);
        if (pendingGetValueRequest == request) 
        { 
            ClearValue(Feature.PendingGetValueRequest);
            int k = (int)request.Args[1]; 

            switch (request.Status)
            {
            case /*AsyncRequestStatus.*/Completed: 
                PW.OnNewValue(k, request.Result);
                SetStatus(PW.Status); 
                if (k == PW.Length - 1) 
                    ParentBindingExpression.TransferValue(request.Result, false);
                break; 

            case /*AsyncRequestStatus.*/Failed:
                ReportGetValueError(k, request.SourceItem, request.Exception);
                PW.OnNewValue(k, DependencyProperty.UnsetValue); 
                break;
            } 
        } 
    }


    void RequestAsyncSetValue(Object item, Object value)
    {
        // get information about the property whose value we want 
        String name = GetNameFromInfo(PW.GetAccessor(PW.Length-1));
//        Invariant.Assert(name != null, "Async SetValue expects a name"); 

        // abandon any previous request
        AsyncSetValueRequest pendingSetValueRequest = (AsyncSetValueRequest)GetValue(Feature.PendingSetValueRequest, null); 
        if (pendingSetValueRequest != null)
        {
            pendingSetValueRequest.Cancel();
        } 

        // issue the new request 
        pendingSetValueRequest = 
            new AsyncSetValueRequest(item, name, value, ParentBinding.AsyncState,
                            DoSetValueCallback, CompleteSetValueCallback, 
                            this);
        SetValue(Feature.PendingSetValueRequest, pendingSetValueRequest);
        Engine.AddAsyncRequest(TargetElement, pendingSetValueRequest);
    } 

    static Object OnSetValueCallback(AsyncDataRequest adr) 
    { 
        AsyncSetValueRequest request = (AsyncSetValueRequest)adr;
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
        worker.PW.SetValue(request.TargetItem, request.Value);
        return null;
    }

    static Object OnCompleteSetValueCallback(AsyncDataRequest adr)
    { 
        AsyncSetValueRequest request = (AsyncSetValueRequest)adr; 
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0];

        DataBindEngine engine = worker.Engine;
        if (engine != null) // could be null if binding has been detached
        {
            engine.Marshal(CompleteSetValueLocalCallback, request); 
        }

        return null; 
    }

    static Object OnCompleteSetValueOperation(Object arg)
    {
        AsyncSetValueRequest request = (AsyncSetValueRequest)arg;
        ClrBindingWorker worker = (ClrBindingWorker)request.Args[0]; 
        worker.CompleteSetValue(request);
        return null; 
    } 

    void CompleteSetValue(AsyncSetValueRequest request) 
    {
        AsyncSetValueRequest pendingSetValueRequest = (AsyncSetValueRequest)GetValue(Feature.PendingSetValueRequest, null);
        if (pendingSetValueRequest == request)
        { 
            ClearValue(Feature.PendingSetValueRequest);

            switch (request.Status) 
            {
            case AsyncRequestStatus.Completed: 
                break;
            case AsyncRequestStatus.Failed:
                Object filteredException = ParentBinding.DoFilterException(ParentBindingExpression, request.Exception);
                Exception exception = filteredException as Exception; 
                ValidationError validationError;

                if (exception != null) 
                {
                    if (TraceData.IsEnabled) 
                    {
                        int k = PW.Length - 1;
                        Object value = request.Value;
                        ReportSetValueError(k, request.TargetItem, request.Value, exception); 
                    }
                } 
                else if ( (validationError = filteredException as ValidationError) != null ) 
                {
                    Validation.MarkInvalid(ParentBindingExpression, validationError); 
                }

                break;
            } 
        }
    } 

    String GetNameFromInfo(Object info)
    { 
        MemberInfo mi;
        PropertyDescriptor pd;

        if ((mi = info as MemberInfo) != null) 
            return mi.Name;

        if ((pd = info as PropertyDescriptor) != null) 
            return pd.Name;

        return null;
    }
//#endregion Async

//#region Callbacks

    private Object ScheduleTransferOperation(Object arg) 
    {
        Object[] a = (Object[])arg; 
        Object o = a[0];
        String propName = (String)a[1];

        // test level again - things may have changed since the operation was invoked 
        int level = PW.LevelForPropertyChange(o, propName);

        if (level >= 0) 
        {
            PW.OnPropertyChangedAtLevel(level); 
        }
        else
        {
            SetTransferIsPending(false); 
        }

        return null; 
    }

//#endregion Callbacks

    //------------------------------------------------------
    // 
    //  Private Enums, Structs, Constants
    // 
    //----------------------------------------------------- 

    static final AsyncRequestCallback DoGetValueCallback = new AsyncRequestCallback(OnGetValueCallback); 
    static final AsyncRequestCallback CompleteGetValueCallback = new AsyncRequestCallback(OnCompleteGetValueCallback);
    static final DispatcherOperationCallback CompleteGetValueLocalCallback = new DispatcherOperationCallback(OnCompleteGetValueOperation);
    static final AsyncRequestCallback DoSetValueCallback = new AsyncRequestCallback(OnSetValueCallback);
    static final AsyncRequestCallback CompleteSetValueCallback = new AsyncRequestCallback(OnCompleteSetValueCallback); 
    static final DispatcherOperationCallback CompleteSetValueLocalCallback = new DispatcherOperationCallback(OnCompleteSetValueOperation);

    //------------------------------------------------------ 
    //
    //  Private Fields 
    //
    //-----------------------------------------------------

    PropertyPathWorker  _pathWorker; 
}

class WeakDependencySource 
{
    protected WeakDependencySource(DependencyObject item, DependencyProperty dp) 
    {
        _item = BindingExpressionBase.CreateReference(item);
        _dp = dp;
    } 

    protected WeakDependencySource(WeakReference wr, DependencyProperty dp) 
    { 
        _item = wr;
        _dp = dp; 
    }

    protected DependencyObject DependencyObject { get { return (DependencyObject)BindingExpressionBase.GetReference(_item); } }
    protected DependencyProperty DependencyProperty { get { return _dp; } } 

    Object _item; 
    DependencyProperty _dp; 
}