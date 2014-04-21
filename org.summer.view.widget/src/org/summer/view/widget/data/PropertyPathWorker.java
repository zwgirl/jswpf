package org.summer.view.widget.data;

import org.summer.view.widget.CollectionViewSource;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.IDisposable;
import org.summer.view.widget.INotifyPropertyChanged;
import org.summer.view.widget.IWeakEventListener;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.PropertyPathStatus;
import org.summer.view.widget.StringComparison;
import org.summer.view.widget.Type;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.controls.DataGrid;
import org.summer.view.widget.internal.DynamicIndexerAccessor;
import org.summer.view.widget.internal.DynamicObjectAccessor;
import org.summer.view.widget.internal.DynamicPropertyAccessor;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.internal.NamedObject;
import org.summer.view.widget.internal.StaticPropertyChangedEventManager;
import org.summer.view.widget.internal.SystemDataHelper;
import org.summer.view.widget.internal.SystemXmlHelper;
import org.summer.view.widget.internal.SystemXmlLinqHelper;
import org.summer.view.widget.internal.ValueChangedEventArgs;
import org.summer.view.widget.internal.ValueChangedEventManager;
import org.summer.view.widget.model.DataErrorsChangedEventArgs;
import org.summer.view.widget.model.ErrorsChangedEventManager;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.INotifyDataErrorInfo;
import org.summer.view.widget.model.PropertyChangedEventArgs;
import org.summer.view.widget.model.PropertyChangedEventManager;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.model.PropertyDescriptorCollection;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.model.TypeDescriptor;
import org.summer.view.widget.reflection.MemberInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;
import org.summer.view.widget.xaml.ReflectionHelper;

/*internal*/ /*sealed*/public class PropertyPathWorker implements IWeakEventListener
{
    //-----------------------------------------------------
    // 
    //  Constructors
    // 
    //----------------------------------------------------- 

    /*internal*/ public PropertyPathWorker(PropertyPath path) 
    {
    	this(path, DataBindEngine.CurrentDataBindEngine);
    }

    /*internal*/public PropertyPathWorker(PropertyPath path, ClrBindingWorker host, boolean isDynamic, DataBindEngine engine)
    { 
    	this(path, engine);
        _host = host;
        _isDynamic = isDynamic; 
    }

    private PropertyPathWorker(PropertyPath path, DataBindEngine engine)
    { 
        _parent = path;
        _arySVS = new SourceValueState[path.Length]; 
        _engine = engine; 

        // initialize each level to NullDataItem, so that the first real 
        // item will force a change
        for (int i=_arySVS.length-1; i>=0; --i)
        {
            _arySVS[i].item = BindingExpression.CreateReference(BindingExpression.NullDataItem); 
        }
    } 

    //------------------------------------------------------
    // 
    //  Internal Properties
    //
    //-----------------------------------------------------

    /*internal*/public  int Length { get { return _parent.Length; } }
    /*internal*/public  PropertyPathStatus Status { get { return _status; } } 

    /*internal*/public  DependencyObject TreeContext
    { 
        get { return BindingExpression.GetReference(_treeContext) as DependencyObject; }
        set { _treeContext = BindingExpression.CreateReference(value); }
    }

    /*internal*/public  void SetTreeContext(WeakReference wr)
    { 
        _treeContext = BindingExpression.CreateReference(wr); 
    }

    /*internal*/public  boolean IsDBNullValidForUpdate
    {
        get
        { 
            if (!_isDBNullValidForUpdate.HasValue)
            { 
                DetermineWhetherDBNullIsValid(); 
            }

            return _isDBNullValidForUpdate.Value;
        }
    }

    /*internal*/public  Object SourceItem
    { 
        get 
        {
            int level = Length-1; 
            Object item = (level >= 0) ? GetItem(level) : null;
            if (item == BindingExpression.NullDataItem)
            {
                item = null; 
            }

            return item; 
        }
    } 

    /*internal*/public  String SourcePropertyName
    {
        get 
        {
            int level = Length-1; 

            if (level < 0)
                return null; 

            switch (SVI[level].type)
            {
                case /*SourceValueType.*/Property: 
                    // return the real name of the property
                    DependencyProperty dp; 
                    PropertyInfo pi; 
                    PropertyDescriptor pd;
                    DynamicPropertyAccessor dpa; 

                    SetPropertyInfo(GetAccessor(level), /*out*/ pi, /*out*/ pd, /*out*/ dp, /*out*/ dpa);
                    return  (dp != null) ? dp.Name :
                            (pi != null) ? pi.Name : 
                            (pd != null) ? pd.Name :
                            (dpa != null) ? dpa.PropertyName : null; 

                case /*SourceValueType.*/Indexer:
                    // return the indexer String, e.g. "[foo]" 
                    String s = _parent.Path;
                    int lastBracketIndex = s.LastIndexOf('[');
                    return s.substring(lastBracketIndex);
            } 

            // in all other cases, no name is available 
            return null; 
        }
    } 

    // true when we need to register for direct notification from the RawValue,
    // i.e. when it's a DO that we get to via a non-DP
    /*internal*/public  boolean NeedsDirectNotification 
    {
        get { return _needsDirectNotification; } 
        private set 
        {
            if (value) 
            {
                _dependencySourcesChanged = true;
            }
            _needsDirectNotification = value; 
        }
    } 

    //------------------------------------------------------
    // 
    //  Internal Methods
    //
    //------------------------------------------------------

    //-------  common methods ------

    /*internal*/public  Object GetItem(int level) 
    {
        return BindingExpression.GetReference(_arySVS[level].item); 
    }

    /*internal*/public  Object GetAccessor(int level)
    { 
        return _arySVS[level].info;
    } 

    /*internal*/public  Object[] GetIndexerArguments(int level)
    { 
        Object[] args = _arySVS[level].args;

        // unwrap the IList wrapper, if any
        IListIndexerArg wrapper; 
        if (args != null && args.length == 1 &&
            (wrapper = args[0] as IListIndexerArg) != null) 
        { 
            return new Object[] { wrapper.Value };
        } 

        return args;
    }

    /*internal*/public  Type GetType(int level)
    { 
        return _arySVS[level].type; 
    }

    //-------  target mode ------

    // Set the context for the path.  Use this method in "target" mode
    // to connect the path to a rootItem for a short time: 
    //      using (path.SetContext(myItem))
    //      { 
    //          ... call target-mode convenience methods ... 
    //      }
    /*internal*/public  IDisposable SetContext(Object rootItem) 
    {
        if (_contextHelper == null)
            _contextHelper = new ContextHelper(this);

        _contextHelper.SetContext(rootItem);
        return _contextHelper; 
    } 

    //-------  source mode (should only be called by ClrBindingWorker) ------ 

    /*internal*/public  void AttachToRootItem(Object rootItem)
    {
        _rootItem = BindingExpression.CreateReference(rootItem); 
        UpdateSourceValueState(-1, null);
    } 

    /*internal*/public  void DetachFromRootItem()
    { 
        _rootItem = BindingExpression.NullDataItem;
        UpdateSourceValueState(-1, null);
        _rootItem = null;
    } 

    /*internal*/public Object GetValue(Object item, int level) 
    { 
//        boolean isExtendedTraceEnabled = IsExtendedTraceEnabled(TraceDataLevel.GetValue);
        DependencyProperty dp; 
        PropertyInfo pi;
        PropertyDescriptor pd;
        DynamicPropertyAccessor dpa;
        Object value = DependencyProperty.UnsetValue; 
        SetPropertyInfo(_arySVS[level].info, /*out*/ pi, /*out*/ pd, /*out*/ dp, /*out*/ dpa);

        switch (SVI[level].type) 
        {
        case /*SourceValueType.*/Property: 
            if (pi != null)
            {
                value = pi.GetValue(item, null);
            } 
            else if (pd != null)
            { 
                boolean indexerIsNext = (level+1 < SVI.length && SVI[level+1].type == SourceValueType.Indexer); 
                value = Engine.GetValue(item, pd, indexerIsNext);
            } 
            else if (dp != null)
            {
                DependencyObject d = (DependencyObject)item;
                if (level != Length-1 || _host == null || _host.TransfersDefaultValue) 
                    value = d.GetValue(dp);
                else if (!Helper.HasDefaultValue(d, dp)) 
                    value = d.GetValue(dp); 
                else
                    value = BindingExpression.IgnoreDefaultValue; 
            }
            else if (dpa != null)
            {
                value = dpa.GetValue(item); 
            }
            break; 

        case /*SourceValueType.*/Indexer:
            DynamicIndexerAccessor dia; 
            //
            if (pi != null)
            {
                Object[] args = _arySVS[level].args; 

                IListIndexerArg wrapper; 
                if (args != null && args.length == 1 && 
                    (wrapper = args[0] as IListIndexerArg) != null)
                { 
                    // common special case: IList indexer.  Avoid
                    // out-of-range exceptions.
                    int index = wrapper.Value;
                    IList ilist = (IList)item; 

                    if (0 <= index && index < ilist.Count) 
                    { 
                        value = ilist[index];
                    } 
                    else
                    {
                        value = IListIndexOutOfRange;
                    } 
                }
                else 
                { 
                    // normal case
                    value = pi.GetValue(item, 
                                    BindingFlags.GetProperty, null,
                                    args,
                                    CultureInfo.InvariantCulture);
                } 
            }
            else if ((dia = _arySVS[level].info as DynamicIndexerAccessor) != null) 
            { 
                value = dia.GetValue(item, _arySVS[level].args);
            } 
            else
            {
                throw new NotSupportedException(/*SR.Get(SRID.IndexedPropDescNotImplemented)*/);
            } 
            break;

        case /*SourceValueType.*/Direct: 
            value = item;
            break; 
        }

//        if (isExtendedTraceEnabled)
//        { 
//            Object accessor = _arySVS[level].info;
//            if (accessor == DependencyProperty.UnsetValue) 
//                accessor = null; 
//
//            TraceData.Trace(TraceEventType.Warning, 
//                                TraceData.GetValue(
//                                    TraceData.Identify(_host.ParentBindingExpression),
//                                    level,
//                                    TraceData.Identify(item), 
//                                    TraceData.IdentifyAccessor(accessor),
//                                    TraceData.Identify(value))); 
//        } 

        return value; 
    }

    /*internal*/public void SetValue(Object item, Object value)
    { 
//        boolean isExtendedTraceEnabled = IsExtendedTraceEnabled(TraceDataLevel.GetValue);
        PropertyInfo pi; 
        PropertyDescriptor pd; 
        DependencyProperty dp;
        DynamicPropertyAccessor dpa; 
        int level = _arySVS.length - 1;
        SetPropertyInfo(_arySVS[level].info, /*out*/ pi, /*out*/ pd, /*out*/ dp, /*out*/ dpa);

//        if (isExtendedTraceEnabled) 
//        {
//            TraceData.Trace(TraceEventType.Warning, 
//                                TraceData.SetValue( 
//                                    TraceData.Identify(_host.ParentBindingExpression),
//                                    level, 
//                                    TraceData.Identify(item),
//                                    TraceData.IdentifyAccessor(_arySVS[level].info),
//                                    TraceData.Identify(value)));
//        } 

        switch (SVI[level].type) 
        { 
        case /*SourceValueType.*/Property:
            if (pd != null) 
            {
                pd.SetValue(item, value);
            }
            else if (pi != null) 
            {
                pi.SetValue(item, value, null); 
            } 
            else if (dp != null)
            { 
                ((DependencyObject)item).SetValue(dp, value);
            }
            else if (dpa != null)
            { 
                dpa.SetValue(item, value);
            } 
            break; 

        case /*SourceValueType.*/Indexer: 
            DynamicIndexerAccessor dia;
            //
            if (pi != null)
            { 
                pi.SetValue(item, value,
                                BindingFlags.SetProperty, null, 
                                GetIndexerArguments(level), 
                                CultureInfo.InvariantCulture);
            } 
            else if ((dia = _arySVS[level].info as DynamicIndexerAccessor) != null)
            {
                dia.SetValue(item, _arySVS[level].args, value);
            } 
            else
            { 
                throw new NotSupportedException(/*SR.Get(SRID.IndexedPropDescNotImplemented)*/); 
            }
            break; 
        }
    }

    /*internal*/ public Object RawValue() 
    {
        Object rawValue = RawValue(Length-1); 

        if (rawValue == AsyncRequestPending)
            rawValue = DependencyProperty.UnsetValue;     // the real value will arrive later 

        return rawValue;
    }

    // Called by BE.UpdateTarget().  Re-fetch the value at each level.
    // If there's a difference, simulate a property-change at that level. 
    /*internal*/public void RefreshValue() 
    {
        for (int k=1; k<_arySVS.length; ++k) 
        {
            Object oldValue = BindingExpression.GetReference(_arySVS[k].item);
            if (!Object.Equals(oldValue, RawValue(k-1)))
            { 
                UpdateSourceValueState(k-1, null);
                return; 
            } 
        }

        UpdateSourceValueState(Length-1, null);
    }

    // return the source level where the change happened, or -1 if the 
    // change is irrelevant.
    /*internal*/public int LevelForPropertyChange(Object item, String propertyName) 
    { 
        // This test must be thread-safe - it can get called on the "wrong" context.
        // It's read-only (good).  And if another thread changes the values it reads, 
        // the worst that can happen is to schedule a transfer operation needlessly -
        // the operation itself won't do anything (since the test is repeated on the
        // right thread).

        boolean isIndexer = propertyName == Binding.IndexerName;

        for (int k=0; k<_arySVS.length; ++k) 
        {
            Object o = BindingExpression.GetReference(_arySVS[k].item); 
            if (o == BindingExpression.StaticSource)
                o = null;

            if (o == item && 
                    (String.IsNullOrEmpty(propertyName) ||
                     (isIndexer && SVI[k].type == SourceValueType.Indexer) || 
                     String.Equals(SVI[k].propertyName, propertyName, StringComparison.OrdinalIgnoreCase))) 
            {
                return k; 
            }
        }

        return -1; 
    }

    /*internal*/public void OnPropertyChangedAtLevel(int level) 
    {
        UpdateSourceValueState(level, null); 
    }

    /*internal*/public void OnCurrentChanged(ICollectionView collectionView)
    { 
        for (int k=0; k<Length; ++k)
        { 
            if (_arySVS[k].collectionView == collectionView) 
            {
                _host.CancelPendingTasks(); 

                // update everything below that level
                UpdateSourceValueState(k, collectionView);
                break; 
            }
        } 
    } 

    // determine if a source invalidation is relevant. 
    // This method must be thread-safe - it can be called on any Dispatcher.
    /*internal*/public boolean UsesDependencyProperty(DependencyObject d, DependencyProperty dp)
    {
        if (dp == DependencyObject.DirectDependencyProperty) 
        {
            // the only way we get notified about this property is when we 
            // ask for it. 
            return true;
        } 

        // find the source level where the change happened
        for (int k=0; k<_arySVS.length; ++k)
        { 
            if ((_arySVS[k].info == dp) && (BindingExpression.GetReference(_arySVS[k].item) == d))
            { 
                return true; 
            }
        } 

        return false;
    }

    /*internal*/public void OnDependencyPropertyChanged(DependencyObject d, DependencyProperty dp, boolean isASubPropertyChange)
    { 
        if (dp == DependencyObject.DirectDependencyProperty) 
        {
            // the only way we get notified about this property is when the raw 
            // value reports a subProperty change.
            UpdateSourceValueState(_arySVS.length, null, BindingExpression.NullDataItem, isASubPropertyChange);
            return;
        } 

        // find the source level where the change happened 
        int k; 
        for (k=0; k<_arySVS.length; ++k)
        { 
            if ((_arySVS[k].info == dp) && (BindingExpression.GetReference(_arySVS[k].item) == d))
            {
                // update everything below that level
                UpdateSourceValueState(k, null, BindingExpression.NullDataItem, isASubPropertyChange); 
                break;
            } 
        } 
    }

    /*internal*/public void OnNewValue(int level, Object value)
    {
        // optimistically assume the new value will fix previous path errors
        _status = PropertyPathStatus.Active; 
        if (level < Length - 1)
            UpdateSourceValueState(level, null, value, false); 
    } 

    // for error reporting only 
    /*internal*/ SourceValueInfo GetSourceValueInfo(int level)
    {
        return SVI[level];
    } 

    /*internal*/ public static boolean IsIndexedProperty(PropertyInfo pi) 
    { 
        boolean result = false;

        // PreSharp uses message numbers that the C# compiler doesn't know about.
        // Disable the C# complaints, per the PreSharp documentation.
//        #pragma warning disable 1634, 1691

        // PreSharp complains about catching NullReference (and other) exceptions.
        // It doesn't recognize that IsCritical[Application]Exception() handles these correctly. 
//        #pragma warning disable 56500 
        try
        { 
            result = (pi != null) && pi.GetIndexParameters().Length > 0;
        }
        catch (Exception ex)
        { 
            // if the PropertyInfo throws an exception, treat it as non-indexed
            if (CriticalExceptions.IsCriticalApplicationException(ex)) 
                throw ex; 
        }

//        #pragma warning restore 56500
//        #pragma warning restore 1634, 1691

        return result; 
    }


    //-----------------------------------------------------
    // 
    //  Private Properties
    //
    //------------------------------------------------------

    boolean IsDynamic { get { return _isDynamic; } }
    SourceValueInfo[] SVI { get { return _parent.SVI; } } 
    DataBindEngine Engine { get { return _engine; } } 

    //----------------------------------------------------- 
    //
    //  Private Methods
    //
    //----------------------------------------------------- 

    // fill in the SourceValueState with updated infomation, starting at level k+1. 
    // If view isn't null, also update the current item at level k. 
    private void UpdateSourceValueState(int k, ICollectionView collectionView)
    { 
        UpdateSourceValueState(k, collectionView, BindingExpression.NullDataItem, false);
    }

    // fill in the SourceValueState with updated infomation, starting at level k+1. 
    // If view isn't null, also update the current item at level k.
    private void UpdateSourceValueState(int k, ICollectionView collectionView, Object newValue, boolean isASubPropertyChange) 
    { 
        // give host a chance to shut down the binding if the target has
        // gone away 
        DependencyObject target = null;
        if (_host != null)
        {
            target = _host.CheckTarget(); 
            if (_rootItem != BindingExpression.NullDataItem && target == null)
                return; 
        } 

        int initialLevel = k; 
        Object rawValue = null;

        // optimistically assume the new value will fix previous path errors
        _status = PropertyPathStatus.Active; 

        // prepare to collect changes to dependency sources 
        _dependencySourcesChanged = false; 

        // Update the current item at level k, if requested 
        if (collectionView != null)
        {
//            Debug.Assert(0<=k && k<_arySVS.Length && _arySVS[k].collectionView == collectionView, "bad parameters to UpdateSourceValueState");
            ReplaceItem(k, collectionView.CurrentItem, NoParent); 
        }

        // update the remaining levels 
        for (++k; k<_arySVS.length; ++k)
        { 
            isASubPropertyChange = false;   // sub-property changes only matter at the last level

            ICollectionView oldCollectionView = _arySVS[k].collectionView;

            // replace the item at level k using parent from level k-1
            rawValue = (newValue == BindingExpression.NullDataItem) ? RawValue(k-1) : newValue; 
            newValue = BindingExpression.NullDataItem; 
            if (rawValue == AsyncRequestPending)
            { 
                _status = PropertyPathStatus.AsyncRequestPending;
                break;      // we'll resume the loop after the request completes
            }

            ReplaceItem(k, BindingExpression.NullDataItem, rawValue);

            // replace view, if necessary 
            ICollectionView newCollectionView = _arySVS[k].collectionView;
            if (oldCollectionView != newCollectionView && _host != null) 
            {
                _host.ReplaceCurrentItem(oldCollectionView, newCollectionView);
            }
        } 

        // notify binding about what happened 
        if (_host != null) 
        {
            if (initialLevel < _arySVS.length) 
            {
                // when something in the path changes, recompute whether we
                // need direct notifications from the raw value
                NeedsDirectNotification = _status == PropertyPathStatus.Active && 
                        _arySVS.length > 0 &&
                        SVI[_arySVS.length-1].type != SourceValueType.Direct && 
                        !(_arySVS[_arySVS.length-1].info instanceof DependencyProperty) && 
                        typeof(DependencyObject).IsAssignableFrom(_arySVS[_arySVS.length-1].type);
            } 

            _host.NewValueAvailable(_dependencySourcesChanged, initialLevel < 0, isASubPropertyChange);
        }

        GC.KeepAlive(target);   // keep target alive during changes (bug 956831)
    } 

    // replace the item at level k with the given item, or with an item obtained from the given parent
    private void ReplaceItem(int k, Object newO, Object parent) 
    {
//        boolean isExtendedTraceEnabled = IsExtendedTraceEnabled(TraceDataLevel.ReplaceItem);
        SourceValueState svs = new SourceValueState();

        Object oldO = BindingExpression.GetReference(_arySVS[k].item);

        // stop listening to old item 
        if (IsDynamic && SVI[k].type != SourceValueType.Direct)
        { 
            INotifyPropertyChanged oldPC;
            DependencyProperty oldDP;
            PropertyInfo oldPI;
            PropertyDescriptor oldPD; 
            DynamicObjectAccessor oldDOA;
            PropertyPath.DowncastAccessor(_arySVS[k].info, /*out*/ oldDP, /*out*/ oldPI, /*out*/ oldPD, /*out*/ oldDOA); 

            if (newO == BindingExpression.StaticSource)
            { 
                Type declaringType = (oldPI != null) ? oldPI.DeclaringType
                                    : (oldPD != null) ? oldPD.ComponentType
                                    : null;
                if (declaringType != null) 
                {
                    StaticPropertyChangedEventManager.RemoveHandler(declaringType, OnStaticPropertyChanged, SVI[k].propertyName); 
                } 
            }
            else if (oldDP != null) 
            {
                _dependencySourcesChanged = true;
            }
            else if ((oldPC = oldO as INotifyPropertyChanged) != null) 
            {
                PropertyChangedEventManager.RemoveHandler(oldPC, OnPropertyChanged, SVI[k].propertyName); 
            } 
            else if (oldPD != null && oldO != null)
            { 
                ValueChangedEventManager.RemoveHandler(oldO, OnValueChanged, oldPD);
            }
        }

        // extra work at the last level
        if (_host != null && k == Length-1) 
        { 
            // handle INotifyDataErrorInfo
            if (IsDynamic && _host.ValidatesOnNotifyDataErrors) 
            {
                INotifyDataErrorInfo indei = oldO as INotifyDataErrorInfo;
                if (indei != null)
                { 
                    ErrorsChangedEventManager.RemoveHandler(indei, OnErrorsChanged);
                } 
            } 
        }

        // clear the IsDBNullValid cache
        _isDBNullValidForUpdate = null;

        if (newO == null || 
            parent == DependencyProperty.UnsetValue ||
            parent == BindingExpression.NullDataItem || 
            parent == BindingExpressionBase.DisconnectedItem) 
        {
            _arySVS[k].item = BindingExpression.ReplaceReference(_arySVS[k].item, newO); 

            if (parent == DependencyProperty.UnsetValue ||
                parent == BindingExpression.NullDataItem ||
                parent == BindingExpressionBase.DisconnectedItem) 
            {
                _arySVS[k].collectionView = null; 
            } 

//            if (isExtendedTraceEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.ReplaceItemShort(
//                                        TraceData.Identify(_host.ParentBindingExpression), 
//                                        k,
//                                        TraceData.Identify(newO))); 
//            } 

            return; 
        }

        // obtain the new item and its access info
        if (newO != BindingExpression.NullDataItem) 
        {
            parent = newO;              // used by error reporting 
            GetInfo(k, newO, /*ref*/ svs); 
            svs.collectionView = _arySVS[k].collectionView;
        } 
        else
        {
            // Note: if we want to support binding to HasValue and/or Value
            // properties of nullable types, we need a way to find out if 
            // the rawvalue is Nullable and pass that information here.

            DrillIn drillIn = SVI[k].drillIn; 
            ICollectionView view = null;

            // first look for info on the parent
            if (drillIn != DrillIn.Always)
            {
                GetInfo(k, parent, /*ref*/ svs); 
            }

            // if that fails, look for information on the view itself 
            if (svs.info == null)
            { 
                view = CollectionViewSource.GetDefaultCollectionView(parent, TreeContext,
                		null // cym add
//                    (x) =>
//                    {
//                        return BindingExpression.GetReference((k == 0) ? _rootItem : _arySVS[k-1].item); 
//                    }
                    );

                if (view != null && drillIn != DrillIn.Always) 
                {
                    if (view != parent)             // don't duplicate work 
                        GetInfo(k, view, /*ref*/ svs);
                }
            }

            // if that fails, drill in to the current item
            if (svs.info == null && drillIn != DrillIn.Never && view != null) 
            { 
                newO = view.CurrentItem;
                if (newO != null) 
                {
                    GetInfo(k, newO, /*ref*/ svs);
                    svs.collectionView = view;
                } 
                else
                { 
                    // no current item: use previous info (if known) 
                    svs = _arySVS[k];
                    svs.collectionView = view; 

                    // if there's no current item because parent is an empty
                    // XmlDataCollection, treat it as a path error (the XPath
                    // didn't return any nodes) 
                    if (!SystemXmlHelper.IsEmptyXmlDataCollection(parent))
                    { 
                        // otherwise it's not an error - currency is simply 
                        // off the collection
                        svs.item = BindingExpression.ReplaceReference(svs.item, BindingExpression.NullDataItem); 
                        if (svs.info == null)
                            svs.info = DependencyProperty.UnsetValue;
                    }
                } 
            }
        } 

        // update info about new item
        if (svs.info == null) 
        {
            svs.item = BindingExpression.ReplaceReference(svs.item, BindingExpression.NullDataItem);
            _arySVS[k] = svs;
            _status = PropertyPathStatus.PathError; 
            ReportNoInfoError(k, parent);
            return; 
        } 

        _arySVS[k] = svs; 
        newO = /*BindingExpression.GetReference(*/svs.item/*)*/;

/*        if (isExtendedTraceEnabled)
        { 
            TraceData.Trace(TraceEventType.Warning,
                                TraceData.ReplaceItemLong( 
                                    TraceData.Identify(_host.ParentBindingExpression), 
                                    k,
                                    TraceData.Identify(newO), 
                                    TraceData.IdentifyAccessor(svs.info)));
        }*/

        // start listening to new item 
        if (IsDynamic && SVI[k].type != SourceValueType.Direct)
        { 
            Engine.RegisterForCacheChanges(newO, svs.info); 

            INotifyPropertyChanged newPC; 
            DependencyProperty newDP;
            PropertyInfo newPI;
            PropertyDescriptor newPD;
            DynamicObjectAccessor newDOA; 
            PropertyPath.DowncastAccessor(svs.info, /*out*/ newDP, /*out*/ newPI, /*out*/ newPD, /*out*/ newDOA);

            if (newO == BindingExpression.StaticSource) 
            {
                Type declaringType = (newPI != null) ? newPI.DeclaringType 
                                    : (newPD != null) ? newPD.ComponentType
                                    : null;
                if (declaringType != null)
                { 
                    StaticPropertyChangedEventManager.AddHandler(declaringType, OnStaticPropertyChanged, SVI[k].propertyName);
                } 
            } 
            else if (newDP != null)
            { 
                _dependencySourcesChanged = true;
            }
            else if ((newPC = (INotifyPropertyChanged) (newO instanceof INotifyPropertyChanged ? newO : null)) != null)
            { 
                PropertyChangedEventManager.AddHandler(newPC, OnPropertyChanged, SVI[k].propertyName);
            } 
            else if (newPD != null && newO != null) 
            {
                ValueChangedEventManager.AddHandler(newO, OnValueChanged, newPD); 
            }
        }

        // extra work at the last level 
        if (_host != null && k == Length-1)
        { 
            // set up the default transformer 
            _host.SetupDefaultValueConverter(svs.type);

            // check for request to update a read-only property
            if (_host.IsReflective)
            {
                CheckReadOnly(newO, svs.info); 
            }

            // handle INotifyDataErrorInfo 
            if (_host.ValidatesOnNotifyDataErrors)
            { 
                INotifyDataErrorInfo indei= (INotifyDataErrorInfo) (newO instanceof INotifyDataErrorInfo ? newO : null);
                if (indei != null)
                {
                    if (IsDynamic) 
                    {
                        ErrorsChangedEventManager.AddHandler(indei, OnErrorsChanged); 
                    } 

                    _host.OnDataErrorsChanged(indei, SourcePropertyName); 
                }
            }
        }
    } 

    void ReportNoInfoError(int k, Object parent) 
    { 
        // report cannot find info.  Ignore when in priority bindings.
        if (TraceData.IsEnabled) 
        {
            BindingExpression bindingExpression = (_host != null) ? _host.ParentBindingExpression : null;
            if (bindingExpression == null || !bindingExpression.IsInPriorityBindingExpression)
            { 
                if (!SystemXmlHelper.IsEmptyXmlDataCollection(parent))
                { 
                    SourceValueInfo svi = SVI[k]; 
                    String cs = (svi.type != SourceValueType.Indexer) ? svi.name : "[" + svi.name + "]";
                    String ps = TraceData.DescribeSourceObject(parent); 
                    String os = (svi.drillIn == DrillIn.Always) ? "current item of collection" : "Object";

                    // if the parent is null, the path error probably only means the
                    // data provider hasn't produced any data yet.  When it does, 
                    // the binding will try again and probably succeed.  Give milder
                    // feedback for this special case, so as not to alarm users unduly. 
                    if (parent == null) 
                    {
                        TraceData.Trace(TraceEventType.Information, TraceData.NullItem(cs, os), bindingExpression); 
                    }
                    // Similarly, if the parent is the NewItemPlaceholder.
                    else if (parent == CollectionView.NewItemPlaceholder ||
                            parent == DataGrid.NewItemPlaceholder) 
                    {
                        TraceData.Trace(TraceEventType.Information, TraceData.PlaceholderItem(cs, os), bindingExpression); 
                    } 
                    else
                    { 
                        TraceEventType traceType = (bindingExpression != null) ? bindingExpression.TraceLevel : TraceEventType.Error;
                        TraceData.Trace(traceType, TraceData.ClrReplaceItem(cs, ps, os), bindingExpression);
                    }
                } 
                else
                { 
                    TraceEventType traceType = (bindingExpression != null) ? bindingExpression.TraceLevel : TraceEventType.Error; 
                    _host.ReportBadXPath(traceType);
                } 

            }
        }
    } 

    // determine if the cached state of the path is still correct.  This is 
    // used to deduce whether event leapfrogging has occurred along the path 
    // (i.e. something changed, but we haven't yet received the notification)
    /*internal*/ boolean IsPathCurrent(Object rootItem) 
    {
        if (Status != PropertyPathStatus.Active)
            return false;

        Object item = rootItem;
        for (int level=0, n=Length; level<n; ++level) 
        { 
            ICollectionView view = _arySVS[level].collectionView;
            if (view != null) 
            {
                item = view.CurrentItem;
            }

            if (!Object.Equals(item, BindingExpression.GetReference(_arySVS[level].item))
                && !IsNonIdempotentProperty(level-1)) 
            { 
                return false;
            } 

            if (level < n-1)
            {
                item = GetValue(item, level); 
            }
        } 

        return true;
    } 

    // Certain properties are known to be non-idempotent, i.e. they return a
    // different value every time the getter is called.   For the purpose of
    // detecting event leapfrogging, the value produced by such a property 
    // should be ignored.
    boolean IsNonIdempotentProperty(int level) 
    { 
        PropertyDescriptor pd;
        if (level < 0 || (pd = _arySVS[level].info as PropertyDescriptor) == null) 
            return false;

        return SystemXmlLinqHelper.IsXLinqNonIdempotentProperty(pd);
    } 

    // look for property/indexer on the given item 
    private void GetInfo(int k, Object item, /*ref*/ SourceValueState svs) 
    {
//#if DEBUG 
//        boolean checkCacheResult = false;
//#endif
        Object oldItem = BindingExpression.GetReference(_arySVS[k].item);
//        boolean isExtendedTraceEnabled = IsExtendedTraceEnabled(TraceDataLevel.GetInfo); 

        // optimization - only change info if the type changed 
        // exception - if the info is a PropertyDescriptor, it might depend 
        // on the item itself (not just the type), so we have to re-fetch
        Type oldType = ReflectionHelper.GetReflectionType(oldItem); 
        Type newType = ReflectionHelper.GetReflectionType(item);
        Type sourceType = null;

        if (newType == oldType && oldItem != BindingExpression.NullDataItem && 
            !(_arySVS[k].info instanceof PropertyDescriptor))
        { 
            svs = _arySVS[k]; 
            svs.item = BindingExpression.ReplaceReference(svs.item, item);

//            if (isExtendedTraceEnabled)
//            {
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.GetInfo_Reuse( 
//                                        TraceData.Identify(_host.ParentBindingExpression),
//                                        k, 
//                                        TraceData.IdentifyAccessor(svs.info))); 
//            }
            return; 
        }

        // if the new item is null, we won't find a property/indexer on it
        if (newType == null && SVI[k].type != SourceValueType.Direct) 
        {
            svs.info = null; 
            svs.args = null; 
            svs.type = null;
            svs.item = BindingExpression.ReplaceReference(svs.item, item); 

//            if (isExtendedTraceEnabled)
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.GetInfo_Null(
//                                        TraceData.Identify(_host.ParentBindingExpression), 
//                                        k)); 
//            }
            return; 
        }

        // optimization - see if we've cached the answer
        int index; 
        boolean cacheAccessor = !PropertyPath.IsParameterIndex(SVI[k].name, /*out*/ index);
        if (cacheAccessor) 
        { 
            AccessorInfo accessorInfo = Engine.AccessorTable[SVI[k].type, newType, SVI[k].name];
            if (accessorInfo != null) 
            {
                svs.info = accessorInfo.Accessor;
                svs.type = accessorInfo.PropertyType;
                svs.args = accessorInfo.Args; 

                if (PropertyPath.IsStaticProperty(svs.info)) 
                    item = BindingExpression.StaticSource; 

                svs.item = BindingExpression.ReplaceReference(svs.item, item); 

                if (IsDynamic && SVI[k].type == SourceValueType.Property && svs.info instanceof DependencyProperty)
                {
                    _dependencySourcesChanged = true; 
                }

//                if (isExtendedTraceEnabled) 
//                {
//                    TraceData.Trace(TraceEventType.Warning, 
//                                        TraceData.GetInfo_Cache(
//                                            TraceData.Identify(_host.ParentBindingExpression),
//                                            k,
//                                            newType.Name, 
//                                            SVI[k].name,
//                                            TraceData.IdentifyAccessor(svs.info))); 
//                } 

//#if DEBUG   // compute the answer the old-fashioned way, and compare 
//                checkCacheResult = true;
//#else
                return;
//#endif 
            }
        } 

        Object info = null;
        Object[] args = null; 

        switch (SVI[k].type)
        {
        case /*SourceValueType.*/Property: 
            info = _parent.ResolvePropertyName(k, item, newType, TreeContext);

//            if (isExtendedTraceEnabled) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.GetInfo_Property(
//                                        TraceData.Identify(_host.ParentBindingExpression),
//                                        k,
//                                        newType.Name, 
//                                        SVI[k].name,
//                                        TraceData.IdentifyAccessor(info))); 
//            } 

            DependencyProperty dp; 
            PropertyInfo pi1;
            PropertyDescriptor pd;
            DynamicObjectAccessor doa;
            PropertyPath.DowncastAccessor(info, /*out*/ dp, /*out*/ pi1, /*out*/ pd, /*out*/ doa); 

            if (dp != null) 
            { 
                sourceType = dp.PropertyType;
                if (IsDynamic) 
                {
//#if DEBUG
//                    if (checkCacheResult)
//                        Debug.Assert(_dependencySourcesChanged, "Cached accessor didn't change sources"); 
//#endif
                    _dependencySourcesChanged = true; 
                } 
                break;
            } 
            else if (pi1 != null)
            {
                sourceType = pi1.PropertyType;
            } 
            else if (pd != null)
            { 
                sourceType = pd.PropertyType; 
            }
            else if (doa != null) 
            {
                sourceType = doa.PropertyType;
//#if DEBUG
//                checkCacheResult = false;      // not relevant for dynamic objects 
//#endif
            } 
            break; 

        case /*SourceValueType.*/Indexer: 
            IndexerParameterInfo[] aryInfo = _parent.ResolveIndexerParams(k, TreeContext);

            // Check if we should treat the indexer as a property instead.
            // (See ShouldConvertIndexerToProperty for why we might do that.) 
            if (aryInfo.length == 1 &&
                (aryInfo[0].type == null || aryInfo[0].type == typeof(String))) 
            { 
                String name = (String)aryInfo[0].value;
                if (ShouldConvertIndexerToProperty(item, /*ref*/ name)) 
                {
                    _parent.ReplaceIndexerByProperty(k, name);
                    goto case SourceValueType.Property;
                } 
            }

            args = new Object[aryInfo.length]; 

            // find the matching indexer 
            MemberInfo[][] aryMembers= new MemberInfo[][]{ GetIndexers(newType, k), null };
            boolean isIList = (item instanceof IList);
            if (isIList)
                aryMembers[1] = typeof(IList).GetDefaultMembers(); 

            for (int ii=0; info==null && ii<aryMembers.length; ++ii) 
            { 
                if (aryMembers[ii] == null)
                    continue; 

                MemberInfo[] defaultMembers = aryMembers[ii];

                for (int jj=0; jj<defaultMembers.length; ++jj) 
                {
                    PropertyInfo pi = defaultMembers[jj] as PropertyInfo; 
                    if (pi != null) 
                    {
                        if (MatchIndexerParameters(pi.GetIndexParameters(), aryInfo, args, isIList)) 
                        {
                            info = pi;
                            sourceType = newType.GetElementType();
                            if (sourceType == null) 
                                sourceType = pi.PropertyType;
                            break; 
                        } 
                    }
                } 
            }

            if (info == null && SystemCoreHelper.IsIDynamicMetaObjectProvider(item))
            { 
                if (MatchIndexerParameters(null, aryInfo, args, false))
                { 
                    info = SystemCoreHelper.GetIndexerAccessor(args.length); 
                    sourceType = typeof(Object);
                } 
            }

//            if (isExtendedTraceEnabled)
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.GetInfo_Indexer( 
//                                        TraceData.Identify(_host.ParentBindingExpression), 
//                                        k,
//                                        newType.Name, 
//                                        SVI[k].name,
//                                        TraceData.IdentifyAccessor(info)));
//            }

            break;

        case /*SourceValueType.*/Direct: 
            if (!(item instanceof ICollectionView) || _host == null || _host.IsValidValue(item))
            { 
                info = DependencyProperty.UnsetValue;
                sourceType = newType;

                if (Length == 1 && 
                        item instanceof Freezable &&    // subproperty notifications only arise from Freezables
                        item != TreeContext)    // avoid self-loops 
                { 
                    info = DependencyObject.DirectDependencyProperty;
                    _dependencySourcesChanged = true; 
                }
            }
            break;
        } 

//#if DEBUG 
//        if (checkCacheResult) 
//        {
//            StringBuilder sb = new StringBuilder(); 
//
//            if (!Object.Equals(info, svs.info))
//                sb.AppendLine(String.Format("  Info is wrong: expected '{0}' got '{1}'",
//                                info, svs.info)); 
//
//            if (sourceType != svs.type) 
//                sb.AppendLine(String.Format("  Type is wrong: expected '{0}' got '{1}'", 
//                                sourceType, svs.type));
//
//            if (item != BindingExpression.GetReference(svs.item))
//                sb.AppendLine(String.Format("  Item is wrong: expected '{0}' got '{1}'",
//                                item, BindingExpression.GetReference(svs.item)));
//
//            int len1 = (args != null) ? args.Length : 0;
//            int len2 = (svs.args != null) ? svs.args.Length : 0; 
//            if (len1 == len2) 
//            {
//                for (int i=0; i<len1; ++i) 
//                {
//                    if (!Object.Equals(args[i], svs.args[i]))
//                    {
//                        sb.AppendLine(String.Format("  args[{0}] is wrong:  expected '{1}' got '{2}'", 
//                                i, args[i], svs.args[i]));
//                    } 
//                } 
//            }
//            else 
//                sb.AppendLine(String.Format("  Args are wrong: expected length '{0}' got length '{1}'",
//                                len1, len2));
//
//            if (sb.Length > 0) 
//            {
//                Debug.Assert(false, 
//                    String.Format("Accessor cache returned incorrect result for ({0},{1},{2})\n{3}", 
//                        SVI[k].type, newType.Name, SVI[k].name, sb.ToString()));
//            } 
//
//            return;
//        }
//#endif 
        if (PropertyPath.IsStaticProperty(info))
            item = BindingExpression.StaticSource; 

        svs.info = info;
        svs.args = args; 
        svs.type = sourceType;
        svs.item = BindingExpression.ReplaceReference(svs.item, item);

        // cache the answer, to avoid doing all that reflection again 
        // (but not if the answer is a PropertyDescriptor,
        // since then the answer potentially depends on the item itself) 
        if (cacheAccessor && info != null && !(info instanceof PropertyDescriptor)) 
        {
            Engine.AccessorTable[SVI[k].type, newType, SVI[k].name] = 
                        new AccessorInfo(info, sourceType, args);
        }
    }

    // get indexers declared by the given type, for the path component at level k
    private MemberInfo[] GetIndexers(Type type, int k) 
    { 
        if (k > 0 && _arySVS[k-1].info == (Object)IndexerPropertyInfo.Instance)
        { 
            // if the previous path component discovered a named indexed property,
            // return all the matches for the name
            List<MemberInfo> list = new List<MemberInfo>();
            String name = SVI[k-1].name; 
            PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);

            // we enumerate through all properties, rather than call GetProperty(name), 
            // to avoid AmbiguousMatchExceptions when there are multiple overloads
            for/*each*/ (PropertyInfo pi : properties) 
            {
                if (pi.Name == name && IsIndexedProperty(pi))
                {
                    list.Add(pi); 
                }
            } 

            return list.ToArray();
        } 
        else
        {
            // C#-style indexed property - GetDefaultMembers does what we need
            return type.GetDefaultMembers(); 
        }
    } 

    // convert the (String) argument names to types appropriate for use with
    // the given property.  Put the results in the args[] array.  Return 
    // true if everything works.
    private boolean MatchIndexerParameters(ParameterInfo[] aryPI, IndexerParameterInfo[] aryInfo, Object[] args, boolean isIList)
    {
        // must have the right number of parameters 
        if (aryPI != null && aryPI.Length != aryInfo.length)
            return false; 

        // each parameter must be settable from user-specified type or from a String
        for (int i=0; i<args.Length; ++i) 
        {
            IndexerParameterInfo pInfo = aryInfo[i];
            Type paramType = (aryPI != null) ? aryPI[i].ParameterType : typeof(Object);
            if (pInfo.type != null) 
            {
                // Check that a user-specified type is compatible with the parameter type 
                if (paramType.IsAssignableFrom(pInfo.type)) 
                {
                    args.SetValue(pInfo.value, i); 
                    continue;
                }
                else
                    return false; 
            }

            // PreSharp uses message numbers that the C# compiler doesn't know about. 
            // Disable the C# complaints, per the PreSharp documentation.
//            #pragma warning disable 1634, 1691 

            // PreSharp complains about catching NullReference (and other) exceptions.
            // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//            #pragma warning disable 56500 

            try 
            { 
                Object arg = null;

                if (paramType == typeof(Integer))
                {
                    // common case is paramType = Int32.  Use TryParse - this
                    // avoids expensive exceptions if it fails 
                    int argInt;
                    if (Int32.TryParse((String)pInfo.value, 
                                NumberStyles.Integer, 
                                TypeConverterHelper.InvariantEnglishUS.NumberFormat,
                                /*out*/ argInt)) 
                    {
                        arg = argInt;
                    }
                } 
                else
                { 
                    TypeConverter tc = TypeDescriptor.GetConverter(paramType); 
                    if (tc != null && tc.CanConvertFrom(typeof(String)))
                    { 
                        arg = tc.ConvertFromString(null, TypeConverterHelper.InvariantEnglishUS,
                                                        (String)pInfo.value);
                        // technically the converter can return null as a legitimate
                        // value.  In practice, this seems always to be a sign that 
                        // the conversion didn't work (often because the converter
                        // reverts to the default behavior - returning null).  So 
                        // we treat null as an "error", and keep trying for something 
                        // better.  (See bug 861966)
                    } 
                }

                if (arg == null && paramType.IsAssignableFrom(typeof(String)))
                { 
                    arg = pInfo.value;
                } 

                if (arg != null)
                    args.SetValue(arg, i); 
                else
                    return false;
            }

            // catch all exceptions.  We simply want to move on to the next
            // candidate indexer. 
            catch (Exception ex) 
            {
                if (CriticalExceptions.IsCriticalApplicationException(ex)) 
                    throw;
                return false;
            }
            catch 
            {
                return false; 
            } 

//            #pragma warning restore 56500 
//            #pragma warning restore 1634, 1691
        }

        // common case is IList - one arg of type Int32.  Wrap the arg so 
        // that we can treat it specially in Get/SetValue.
        if (isIList && aryPI.Length == 1 && aryPI[0].ParameterType == typeof(Integer)) 
        { 
            args[0] = new IListIndexerArg((int)args[0]);
        } 

        return true;
    }

    private boolean ShouldConvertIndexerToProperty(Object item, /*ref*/ String name)
    { 
        // Special case for ADO.  If the path specifies an indexer on a DataRowView, 
        // and if the DRV exposes a property with the same name as the indexer
        // argument, use the property instead.  (E.g. convert [foo] to .foo) 
        // This works around a problem in ADO - they raise PropertyChanged for
        // property "foo", but they don't raise PropertyChanged for "Item[]".
        // See bug 1180454.
        // Likewise when the indexer arg is an integer - convert to the corresponding named property. 
        if (SystemDataHelper.IsDataRowView(item))
        { 
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(item); 
            if (properties[name] != null)
                return true; 

            int index;
            if (Int32.TryParse(name,
                                NumberStyles.Integer, 
                                TypeConverterHelper.InvariantEnglishUS.NumberFormat,
                                /*out*/ index)) 
            { 
                if (0 <= index && index < properties.Count)
                { 
                    name = properties[index].Name;
                    return true;
                }
            } 
        }

        return false; 
    }

    // return the raw value from level k
    private Object RawValue(int k)
    {
        if (k < 0) 
            return BindingExpression.GetReference(_rootItem);
        if (k >= _arySVS.length) 
            return DependencyProperty.UnsetValue; 

        Object item = BindingExpression.GetReference(_arySVS[k].item); 
        Object info = _arySVS[k].info;

        // try to get the value, unless (a) binding is being detached,
        // (b) no info - e.g. Nullable with no value, or (c) item expected 
        // but not present - e.g. currency moved off the end.
        if (item != BindingExpression.NullDataItem && info != null && !(item == null && info != DependencyProperty.UnsetValue)) 
        { 
            Object o = DependencyProperty.UnsetValue;
            DependencyProperty dp = info as DependencyProperty; 

            // if the binding is async, post a request to get the value
            if (!(dp != null || SVI[k].type == SourceValueType.Direct))
            { 
                if (_host != null && _host.AsyncGet(item, k))
                { 
                    _status = PropertyPathStatus.AsyncRequestPending; 
                    return AsyncRequestPending;
                } 
            }

            // PreSharp uses message numbers that the C# compiler doesn't know about.
            // Disable the C# complaints, per the PreSharp documentation. 
//            #pragma warning disable 1634, 1691

            // PreSharp complains about catching NullReference (and other) exceptions. 
            // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//            #pragma warning disable 56500 

            try
            {
                o = GetValue(item, k); 
            }
            // Catch all exceptions.  There is no app code on the stack, 
            // so the exception isn't actionable by the app. 
            // Yet we don't want to crash the app.
            catch (Exception ex)    // if error getting value, we will use fallback/default instead 
            {
                if (CriticalExceptions.IsCriticalApplicationException(ex))
                    throw ex;
                if (_host != null) 
                    _host.ReportGetValueError(k, item, ex);
            } 
            catch // non CLS compliant exception 
            {
                if (_host != null) 
                    _host.ReportGetValueError(k, item, new InvalidOperationException(/*SR.Get(SRID.NonCLSException, "GetValue")*/));
            }

            // catch the pseudo-exception as well 
            if (o == IListIndexOutOfRange)
            { 
                o = DependencyProperty.UnsetValue; 
                if (_host != null)
                    _host.ReportGetValueError(k, item, new ArgumentOutOfRangeException("index")); 
            }

//            #pragma warning restore 56500
//            #pragma warning restore 1634, 1691 

            return o; 
        } 

        if (_host != null) 
        {
            _host.ReportRawValueErrors(k, item, info);
        }

        return DependencyProperty.UnsetValue;
    } 

    void SetPropertyInfo(Object info, /*out*/ PropertyInfo pi, /*out*/ PropertyDescriptor pd, /*out*/ DependencyProperty dp, /*out*/ DynamicPropertyAccessor dpa)
    { 
        pi = null;
        pd = null;
        dpa = null;
        dp = info as DependencyProperty; 

        if (dp == null) 
        { 
            pi = info as PropertyInfo;
            if (pi == null) 
            {
                pd = info as PropertyDescriptor;

                if (pd == null) 
                    dpa = info as DynamicPropertyAccessor;
            } 
        } 
    }

    void CheckReadOnly(Object item, Object info)
    {
        PropertyInfo pi;
        PropertyDescriptor pd; 
        DependencyProperty dp;
        DynamicPropertyAccessor dpa; 
        SetPropertyInfo(info, /*out*/ pi, /*out*/ pd, /*out*/ dp, /*out*/ dpa); 

        if (pi != null) 
        {
            if (!pi.CanWrite)
                throw new InvalidOperationException(/*SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), pi.Name)*/);
        } 
        else if (pd != null)
        { 
            if (pd.IsReadOnly) 
                throw new InvalidOperationException(/*SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), pd.Name)*/);
        } 
        else if (dp != null)
        {
            if (dp.ReadOnly)
                throw new InvalidOperationException(/*SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), dp.Name)*/); 
        }
        else if (dpa != null) 
        { 
            if (dpa.IsReadOnly)
                throw new InvalidOperationException(/*SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), dpa.PropertyName)*/); 
        }
    }

    // see whether DBNull is a valid value for update, and cache the answer 
    void DetermineWhetherDBNullIsValid()
    { 
        boolean result = false; 
        Object item = GetItem(Length - 1);

        if (item != null && AssemblyHelper.IsLoaded(UncommonAssembly.System_Data))
        {
            result = DetermineWhetherDBNullIsValid(item);
        } 

        _isDBNullValidForUpdate = result; 
    } 

    boolean DetermineWhetherDBNullIsValid(Object item) 
    {
        PropertyInfo pi;
        PropertyDescriptor pd;
        DependencyProperty dp; 
        DynamicPropertyAccessor dpa;
        SetPropertyInfo(_arySVS[Length-1].info, /*out*/ pi, /*out*/ pd, /*out*/ dp, /*out*/ dpa); 

        String columnName = (pd != null) ? pd.Name :
                            (pi != null) ? pi.Name : null; 

        Object arg = (columnName == "Item" && pi != null) ? _arySVS[Length-1].args[0] : null;

        return SystemDataHelper.DetermineWhetherDBNullIsValid(item, columnName, arg); 
    }

    /// <summary> 
    /// Handle events from the centralized event table
    /// </summary> 
    public boolean /*IWeakEventListener.*/ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
    {
        return false;   // this method is no longer used (but must remain, for compat)
    } 

    void OnPropertyChanged(Object sender, PropertyChangedEventArgs e) 
    { 
//        if (IsExtendedTraceEnabled(TraceDataLevel.Events))
//        { 
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.GotEvent(
//                                    TraceData.Identify(_host.ParentBindingExpression),
//                                    "PropertyChanged", 
//                                    TraceData.Identify(sender)));
//        } 

        _host.OnSourcePropertyChanged(sender, e.PropertyName);
    } 

    void OnValueChanged(Object sender, ValueChangedEventArgs e)
    {
//        if (IsExtendedTraceEnabled(TraceDataLevel.Events)) 
//        {
//            TraceData.Trace(TraceEventType.Warning, 
//                                TraceData.GotEvent( 
//                                    TraceData.Identify(_host.ParentBindingExpression),
//                                    "ValueChanged", 
//                                    TraceData.Identify(sender)));
//        }

        _host.OnSourcePropertyChanged(sender, e.PropertyDescriptor.Name); 
    }

    void OnErrorsChanged(Object sender, DataErrorsChangedEventArgs e) 
    {
        if (e.PropertyName == SourcePropertyName) 
        {
            _host.OnDataErrorsChanged((INotifyDataErrorInfo)sender, e.PropertyName);
        }
    } 

    void OnStaticPropertyChanged(Object sender, PropertyChangedEventArgs e) 
    { 
//        if (IsExtendedTraceEnabled(TraceDataLevel.Events))
//        { 
//            TraceData.Trace(TraceEventType.Warning,
//                                TraceData.GotEvent(
//                                    TraceData.Identify(_host.ParentBindingExpression),
//                                    "PropertyChanged", 
//                                    "(static)"));
//        } 

        _host.OnSourcePropertyChanged(sender, e.PropertyName);
    } 

//    boolean IsExtendedTraceEnabled(TraceDataLevel level)
//    {
//        if (_host != null) 
//        {
//            return TraceData.IsExtendedTraceEnabled(_host.ParentBindingExpression, level); 
//        } 
//        else
//        { 
//            return false;
//        }
//    }

    //-----------------------------------------------------
    // 
    //  Private Classes 
    //
    //------------------------------------------------------ 

    // helper for setting context via the "using" pattern
    class ContextHelper implements IDisposable
    { 
        PropertyPathWorker _owner;

        public ContextHelper(PropertyPathWorker owner) 
        {
            _owner = owner; 
        }

        public void SetContext(Object rootItem)
        { 
            _owner.TreeContext = (DependencyObject) (rootItem instanceof DependencyObject ? rootItem : null);
            _owner.AttachToRootItem(rootItem); 
        } 

        public void /*IDisposable.*/Dispose() 
        {
            _owner.DetachFromRootItem();
            _owner.TreeContext = null;
            GC.SuppressFinalize(this); 
        }
    } 

    // wrapper for arguments to IList indexer
    class IListIndexerArg 
    {
        public IListIndexerArg(int arg)
        {
            _arg = arg; 
        }

        public int Value { get { return _arg; } } 

        int _arg; 
    }

    //-----------------------------------------------------
    // 
    //  Private Enums, Structs, Constants
    // 
    //------------------------------------------------------ 

    class SourceValueState 
    {
        public ICollectionView collectionView;
        public Object item;
        public Object info;             // PropertyInfo or PropertyDescriptor or DP 
        public Type type;               // Type of the value (useful for Arrays)
        public Object[] args;           // for indexers 
    } 

    static final Char[] s_comma = new Char[]{','}; 
    static final Char[] s_dot   = new Char[]{'.'};

    static final Object NoParent = new NamedObject("NoParent");
    static final Object AsyncRequestPending = new NamedObject("AsyncRequestPending"); 
    /*internal*/ static final Object IListIndexOutOfRange = new NamedObject("IListIndexOutOfRange");

    //------------------------------------------------------ 
    //
    //  Private Fields 
    //
    //-----------------------------------------------------

    PropertyPath        _parent; 
    PropertyPathStatus  _status;
    Object              _treeContext; 
    Object              _rootItem; 
    SourceValueState[]  _arySVS;
    ContextHelper       _contextHelper; 

    ClrBindingWorker    _host;
    DataBindEngine      _engine;

    boolean                _dependencySourcesChanged;
    boolean                _isDynamic; 
    boolean                _needsDirectNotification; 
    Boolean              _isDBNullValidForUpdate;
} 