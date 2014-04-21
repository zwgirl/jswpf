package org.summer.view.widget;

import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.data.CollectionView;
import org.summer.view.widget.data.CollectionViewProxy;
import org.summer.view.widget.data.DataBindEngine;
import org.summer.view.widget.data.DataChangedEventManager;
import org.summer.view.widget.data.DataSourceProvider;
import org.summer.view.widget.internal.InheritanceContextHelper;
import org.summer.view.widget.internal.ViewRecord;
import org.summer.view.widget.markup.XmlLanguage;
import org.summer.view.widget.model.GroupDescription;
import org.summer.view.widget.model.ICollectionView;
import org.summer.view.widget.model.IListSource;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.model.SortDescriptionCollection;

/// <summary>
    ///  Describes a collection view.
/// </summary>
public class CollectionViewSource extends DependencyObject implements ISupportInitialize, IWeakEventListener
    {
  
        //
        //  Constructors
        //
 
        /// <summary>
        ///     Initializes a new instance of the CollectionViewSource class.
        /// </summary>
        public CollectionViewSource()
        {
            _sort = new SortDescriptionCollection();
            ((INotifyCollectionChanged)_sort).CollectionChanged += new NotifyCollectionChangedEventHandler(OnForwardedCollectionChanged);
  
            _groupBy = new ObservableCollection<GroupDescription>();
            ((INotifyCollectionChanged)_groupBy).CollectionChanged += new NotifyCollectionChangedEventHandler(OnForwardedCollectionChanged);
        }
 
  
        //
        //  Public Properties
        //
 
        /// <summary>
        ///     The key needed to define a read-only property.
        /// </summary>
        private static final DependencyPropertyKey ViewPropertyKey
            = DependencyProperty.RegisterReadOnly(
                    "View",
                    typeof(ICollectionView),
                    typeof(CollectionViewSource),
                    new FrameworkPropertyMetadata((ICollectionView)null));
 
        /// <summary>
        ///     The DependencyProperty for the View property.
        ///     Flags:              None
        ///     Other:              Read-Only
        ///     Default Value:      null
        /// </summary>
        public static final DependencyProperty ViewProperty
            = ViewPropertyKey.DependencyProperty;
 
        /// <summary>
        ///     Returns the ICollectionView currently affiliated with this CollectionViewSource.
        /// </summary>
//        [ReadOnly(true)]
        public ICollectionView View
        {
            get
            {
                return GetOriginalView(CollectionView);
            }
        }
 
  
  
        /// <summary>
        ///     The DependencyProperty for the Source property.
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
        public static final DependencyProperty SourceProperty
            = DependencyProperty.Register(
                    "Source",
                    typeof(Object),
                    typeof(CollectionViewSource),
                    new FrameworkPropertyMetadata(
                            (Object)null,
                            new PropertyChangedCallback(OnSourceChanged)),
                    new ValidateValueCallback(IsSourceValid));
  
        /// <summary>
        ///     Source is the underlying collection.
        /// </summary>
        public Object Source
        {
            get { return (Object) GetValue(SourceProperty); }
            set { SetValue(SourceProperty, value); }
        }
  
        /// <summary>
        ///     Called when SourceProperty is invalidated on "d."
        /// </summary>
        /// <param name="d">The Object on which the property was invalidated.
        /// <param name="e">Argument.
        private static void OnSourceChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            CollectionViewSource ctrl = (CollectionViewSource) d;
  
            ctrl.OnSourceChanged(e.OldValue, e.NewValue);
            ctrl.EnsureView();
        }
 
        /// <summary>
        ///     This method is invoked when the Source property changes.
        /// </summary>
        /// <param name="oldSource">The old value of the Source property.
        /// <param name="newSource">The new value of the Source property.
        protected /*virtual*/ void OnSourceChanged(Object oldSource, Object newSource)
        {
        }
 
        private static boolean IsSourceValid(Object o)
        {
            return (o == null ||
                        o instanceof IEnumerable ||
                        o instanceof IListSource ||
                        o instanceof DataSourceProvider) &&
                    !(o instanceof ICollectionView);
        }
 
        private static boolean IsValidSourceForView(Object o)
        {
            return (o == null ||
                        o instanceof IEnumerable ||
                        o instanceof IListSource);
        }
  
  
 
        /// <summary>
        ///     The DependencyProperty for the CollectionViewType property.
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
        public static final DependencyProperty CollectionViewTypeProperty
            = DependencyProperty.Register(
                    "CollectionViewType",
                    typeof(Type),
                    typeof(CollectionViewSource),
                    new FrameworkPropertyMetadata(
                            (Type)null,
                            new PropertyChangedCallback(OnCollectionViewTypeChanged)),
                    new ValidateValueCallback(IsCollectionViewTypeValid));
 
        /// <summary>
        ///     CollectionViewType is the desired type of the View.
        /// </summary>
        /// <remarks>
        ///     This property may only be set during initialization.
        /// </remarks>
        public Type CollectionViewType
        {
            get { return (Type) GetValue(CollectionViewTypeProperty); }
            set { SetValue(CollectionViewTypeProperty, value); }
        }
 
        private static void OnCollectionViewTypeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            CollectionViewSource ctrl = (CollectionViewSource) d;
 
            Type oldCollectionViewType = (Type) e.OldValue;
            Type newCollectionViewType = (Type) e.NewValue;
  
            if (!ctrl._isInitializing)
                throw new InvalidOperationException(/*SR.Get(SRID.CollectionViewTypeIsInitOnly)*/);
  
            ctrl.OnCollectionViewTypeChanged(oldCollectionViewType, newCollectionViewType);
            ctrl.EnsureView();
        }
  
        /// <summary>
        ///     This method is invoked when the CollectionViewType property changes.
        /// </summary>
        /// <param name="oldCollectionViewType">The old value of the CollectionViewType property.
        /// <param name="newCollectionViewType">The new value of the CollectionViewType property.
        protected /*virtual*/ void OnCollectionViewTypeChanged(Type oldCollectionViewType, Type newCollectionViewType)
        {
        }
  
        private static boolean IsCollectionViewTypeValid(Object o)
        {
            Type type = (Type)o;
 
            return type == null ||
                typeof(ICollectionView).IsAssignableFrom(type);
        }
 
        /// <summary>
        /// CultureInfo used for sorting, comparisons, etc.
        /// This property is forwarded to any collection view created from this source.
        /// </summary>
//        [TypeConverter(typeof(System.Windows.CultureInfoIetfLanguageTagConverter))]
        public CultureInfo Culture
        {
            get { return _culture; }
            set { _culture = value; OnForwardedPropertyChanged(); }
        }
 
        /// <summary>
        /// Collection of SortDescriptions, describing sorting.
        /// This property is forwarded to any collection view created from this source.
        /// </summary>
        public SortDescriptionCollection SortDescriptions
        {
            get { return _sort; }
        }
 
        /// <summary>
        /// Collection of GroupDescriptions, describing grouping.
        /// This property is forwarded to any collection view created from this source.
        /// </summary>
        public ObservableCollection<GroupDescription> GroupDescriptions
        {
            get { return _groupBy; }
        }
 
//        #endregion Public Properties
//  
//        #region Public Events
  
        /// <summary>
        ///     An event requesting a filter query.
        /// </summary>
        public /*event*/ FilterEventHandler Filter
        {
            add
            {
                // Get existing event hanlders
                FilterEventHandler handlers = FilterHandlersField.GetValue(this);
                if (handlers != null)
                {
                    // combine to a multicast delegate
                    handlers = (FilterEventHandler)Delegate.Combine(handlers, value);
                }
                else
                {
                    handlers = value;
                }
                // Set the delegate as an uncommon field
                FilterHandlersField.SetValue(this, handlers);
 
                OnForwardedPropertyChanged();
            }
            remove
            {
                // Get existing event hanlders
                FilterEventHandler handlers = FilterHandlersField.GetValue(this);
                if (handlers != null)
                {
                    // Remove the given handler
                    handlers = (FilterEventHandler)Delegate.Remove(handlers, value);
                    if (handlers == null)
                    {
                        // Clear the value for the uncommon field
                        // cause there are no more handlers
                        FilterHandlersField.ClearValue(this);
                    }
                    else
                    {
                        // Set the remaining handlers as an uncommon field
                        FilterHandlersField.SetValue(this, handlers);
                    }
                }
 
                OnForwardedPropertyChanged();
            }
        }
 
//        #endregion Public Events
// 
//        #region Public Methods
  
        //
        //  Public Methods
        //
 
        /// <summary>
        /// Return the default view for the given source.  This view is never
        /// affiliated with any CollectionViewSource.
        /// </summary>
        public static ICollectionView GetDefaultView(Object source)
        {
            return GetOriginalView(GetDefaultCollectionView(source, true));
        }
 
        // a version of the previous method that doesn't create the view (bug 108595)
        private static ICollectionView LazyGetDefaultView(Object source)
        {
            return GetOriginalView(GetDefaultCollectionView(source, false));
        }
 
        /// <summary>
        /// Return true if the given view is the default view for its source.
        /// </summary>
        public static boolean IsDefaultView(ICollectionView view)
        {
            if (view != null)
            {
                Object source = view.SourceCollection;
                return (GetOriginalView(view) == LazyGetDefaultView(source));
            }
            else
            {
                return true;
            }
        }
  
        /// <summary>
        /// Enter a Defer Cycle.
        /// Defer cycles are used to coalesce changes to the ICollectionView.
        /// </summary>
        public IDisposable DeferRefresh()
        {
            return new DeferHelper(this);
        }
  
//        #endregion Public Methods
 
        //
        //  Interfaces
        //
 
//        #region ISupportInitialize
 
        /// <summary>Signals the Object that initialization is starting.</summary>
        public void /*ISupportInitialize.*/BeginInit()
        {
            _isInitializing = true;
        }
 
        /// <summary>Signals the Object that initialization is complete.</summary>
        public void /*ISupportInitialize.*/EndInit()
        {
            _isInitializing = false;
            EnsureView();
        }
  
//        #endregion ISupportInitialize
 
//        #region IWeakEventListener
  
        /// <summary>
        /// Handle events from the centralized event table
        /// </summary>
//        boolean IWeakEventListener.ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
//        {
//            return ReceiveWeakEvent(managerType, sender, e);
//        }
 
        /// <summary>
        /// Handle events from the centralized event table
        /// </summary>
        public /*virtual*/ boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e)
        {
            if (managerType == typeof(DataChangedEventManager))
            {
                EnsureView();
            }
            else
            {
                return false;       // unrecognized event
            }
 
            return true;
        }
 
//        #endregion IWeakEventListener
//  
//        #region Internal Properties
  
        //
        //  Internal Properties
        //
 
        // Returns the CollectionView currently affiliate with this CollectionViewSource.
        // This may be a CollectionViewProxy over the original view.
         public CollectionView CollectionView
        {
            get
            {
                ICollectionView view = (ICollectionView)GetValue(ViewProperty);
  
                if (view != null && !_isViewInitialized)
                {
                    // leak prevention: re-fetch ViewRecord instead of keeping a reference to it,
                    // to be sure that we don't inadvertently keep it alive.
                    Object source = Source;
                    DataSourceProvider dataProvider = source as DataSourceProvider;
  
                    // if the source is DataSourceProvider, use its Data instead
                    if (dataProvider != null)
                    {
                        source = dataProvider.Data;
                    }
  
                    if (source != null)
                    {
                        DataBindEngine engine = DataBindEngine.CurrentDataBindEngine;
                        ViewRecord viewRecord = engine.GetViewRecord(source, this, CollectionViewType, true);
                        if (viewRecord != null)
                        {
                            viewRecord.InitializeView();
                            _isViewInitialized = true;
                        }
                    }
                }
  
                return (CollectionView)view;
            }
        }
 
        // Returns the property through which inheritance context was established
         public DependencyProperty PropertyForInheritanceContext
        {
            get { return _propertyForInheritanceContext; }
        }
 
//        #endregion Internal Properties
// 
//        #region Internal Methods
 
        //
        //  Internal Methods
        //
  
        // Return the default view for the given source.  This view is never
        // affiliated with any CollectionViewSource.  It may be a
        // CollectionViewProxy over the original view
        static  CollectionView GetDefaultCollectionView(Object source, boolean createView)
        {
            if (!IsValidSourceForView(source))
                return null;
  
            DataBindEngine engine = DataBindEngine.CurrentDataBindEngine;
            ViewRecord viewRecord = engine.GetViewRecord(source, DefaultSource, null, createView);
  
            return (viewRecord != null) ? (CollectionView)viewRecord.View : null;
        }
 
        /// <summary>
        /// Return the default view for the given source.  This view is never
        /// affiliated with any CollectionViewSource.  The  version sets
        /// the culture on the view from the xml:Lang of the host Object.
        /// </summary>
         static CollectionView GetDefaultCollectionView(Object source, DependencyObject d)
        {
            CollectionView view = GetDefaultCollectionView(source, true);
 
            // at first use of a view, set its culture from the xml:lang of the
            // element that's using the view
            if (view != null && view.Culture == null)
            {
                XmlLanguage language = (d != null) ? (XmlLanguage)d.GetValue(FrameworkElement.LanguageProperty) : null;
                if (language != null)
                {
                    try
                    {
                        view.Culture = language.GetSpecificCulture();
                    }
                    catch (InvalidOperationException ex)
                    {
                    }
                }
            }
 
            return view;
        }
 
        // Define the DO's inheritance context
          DependencyObject InheritanceContext
        {
            get { return _inheritanceContext; }
        }
 
        // Receive a new inheritance context (this will be a FE/FCE)
          public void AddInheritanceContext(DependencyObject context, DependencyProperty property)
        {
            // remember which property caused the context - BindingExpression wants to know
            // (this must happen before calling AddInheritanceContext, so that the answer
            // is ready during the InheritanceContextChanged event)
            if (!_hasMultipleInheritanceContexts && _inheritanceContext == null)
            {
                _propertyForInheritanceContext = property;
            }
            else
            {
                _propertyForInheritanceContext = null;
            }
 
            InheritanceContextHelper.AddInheritanceContext(context,
                                                              this,
                                                              /*ref*/ _hasMultipleInheritanceContexts,
                                                              /*ref*/ _inheritanceContext );
        }
 
        // Remove an inheritance context (this will be a FE/FCE)
          public void RemoveInheritanceContext(DependencyObject context, DependencyProperty property)
        {
            InheritanceContextHelper.RemoveInheritanceContext(context,
                                                                  this,
                                                                  /*ref*/ _hasMultipleInheritanceContexts,
                                                                  /*ref*/ _inheritanceContext);
  
            // after removing a context, we don't know which property caused it
            _propertyForInheritanceContext = null;
        }
 
        // Says if the current instance has multiple InheritanceContexts
          boolean HasMultipleInheritanceContexts
        {
            get { return _hasMultipleInheritanceContexts; }
        }
 
        //
  
         boolean IsShareableInTemplate()
        {
            return false;
        }
 
//        #endregion Internal Methods
 
//        #region Private Methods
  
        //
        //  Private Methods
        //
 
        // Obtain the view affiliated with the current source.  This may create
        // a new view, or re-use an existing one.
        void EnsureView()
        {
            EnsureView(Source, CollectionViewType);
        }
  
        void EnsureView(Object source, Type collectionViewType)
        {
            if (_isInitializing || _deferLevel > 0)
                return;
 
            DataSourceProvider dataProvider = source as DataSourceProvider;
  
            // listen for DataChanged events from an DataSourceProvider
            if (dataProvider != _dataProvider)
            {
                if (_dataProvider != null)
                {
                    DataChangedEventManager.RemoveListener(_dataProvider, this);
                }
  
                _dataProvider = dataProvider;
 
                if (_dataProvider != null)
                {
                    DataChangedEventManager.AddListener(_dataProvider, this);
                    _dataProvider.InitialLoad();
                }
            }
  
            // if the source is DataSourceProvider, use its Data instead
            if (dataProvider != null)
            {
                source = dataProvider.Data;
            }
 
            // get the view
            ICollectionView view = null;
  
            if (source != null)
            {
                DataBindEngine engine = DataBindEngine.CurrentDataBindEngine;
                ViewRecord viewRecord = engine.GetViewRecord(source, this, collectionViewType, true);
 
                if (viewRecord != null)
                {
                    view = viewRecord.View;
                    _isViewInitialized = viewRecord.IsInitialized;
  
                    // bring view up to date with the CollectionViewSource
                    if (_version != viewRecord.Version)
                    {
                        ApplyPropertiesToView(view);
                        viewRecord.Version = _version;
                    }
                }
            }
  
            // update the View property
            SetValue(ViewPropertyKey, view);
        }
 
        // Forward properties from the CollectionViewSource to the CollectionView
        void ApplyPropertiesToView(ICollectionView view)
        {
            if (view == null || _deferLevel > 0)
                return;
 
            using (view.DeferRefresh())
            {
                int i, n;
 
                // Culture
                if (Culture != null)
                {
                    view.Culture = Culture;
                }
  
                // Sort
                if (view.CanSort)
                {
                    view.SortDescriptions.Clear();
                    for (i=0, n=SortDescriptions.Count;  i < n;  ++i)
                    {
                        view.SortDescriptions.Add(SortDescriptions[i]);
                    }
                }
                else if (SortDescriptions.Count > 0)
                    throw new InvalidOperationException(/*SR.Get(SRID.CannotSortView, view)*/);
 
                // Filter
                Predicate<Object> filter;
                if (FilterHandlersField.GetValue(this) != null)
                {
                    filter = FilterWrapper;
                }
                else
                {
                    filter = null;
                }
 
                if (view.CanFilter)
                {
                    view.Filter = filter;
                }
                else if (filter != null)
                    throw new InvalidOperationException(SR.Get(SRID.CannotFilterView, view));
 
                // GroupBy
                if (view.CanGroup)
                {
                    view.GroupDescriptions.Clear();
                    for (i=0, n=GroupDescriptions.Count;  i < n;  ++i)
                    {
                        view.GroupDescriptions.Add(GroupDescriptions[i]);
                    }
                }
                else if (GroupDescriptions.Count > 0)
                    throw new InvalidOperationException(SR.Get(SRID.CannotGroupView, view));
            }
        }
 
        // return the original (un-proxied) view for the given view
        static ICollectionView GetOriginalView(ICollectionView view)
        {
            for (   CollectionViewProxy proxy = view as CollectionViewProxy;
                    proxy != null;
                    proxy = view as CollectionViewProxy)
            {
                view = proxy.ProxiedView;
            }
  
            return view;
        }
 
        Predicate<Object> FilterWrapper
        {
            get
            {
                if (_filterStub == null)
                {
                    _filterStub = new FilterStub(this);
                }
 
                return _filterStub.FilterWrapper;
            }
        }
  
        boolean WrapFilter(Object item)
        {
            FilterEventArgs args = new FilterEventArgs(item);
            FilterEventHandler handlers = FilterHandlersField.GetValue(this);
 
            if (handlers != null)
            {
                handlers(this, args);
            }
 
            return args.Accepted;
        }
 
        // a change occurred in one of the collections that we forward to the view
        void OnForwardedCollectionChanged(Object sender, NotifyCollectionChangedEventArgs e)
        {
            OnForwardedPropertyChanged();
        }
 
        // a change occurred in one of the properties that we forward to the view
        void OnForwardedPropertyChanged()
        {
            // increment the version number.  This causes the change to get applied
            // to dormant views when they become active.
            unchecked {++ _version;}
  
            // apply the change to the current view
            ApplyPropertiesToView(View);
        }
 
        // defer changes
        void BeginDefer()
        {
            ++ _deferLevel;
        }
  
        void EndDefer()
        {
            if (--_deferLevel == 0)
            {
                EnsureView();
            }
        }
  
        //
        //  This property
        //  1. Finds the correct initial size for the _effectiveValues store on the current DependencyObject
        //  2. This is a performance optimization
        //
          int EffectiveValuesInitialSize
        {
            get { return 3; }
        }
  
//        #endregion Private Methods
  
//        #region Private Types
 
        //
        //  Private Types
        //
  
        /*private*/ class DeferHelper implements IDisposable
        {
            public DeferHelper(CollectionViewSource target)
            {
                _target = target;
                _target.BeginDefer();
            }
 
            public void Dispose()
            {
                if (_target != null)
                {
                    CollectionViewSource target = _target;
                    _target = null;
                    target.EndDefer();
                }
                GC.SuppressFinalize(this);
            }
  
            private CollectionViewSource _target;
        }
 
        // This class is used to break the reference chain from a collection
        // view to a UI element (typically Window or Page), created when the
        // app adds a handler (belonging to the Window or Page) to the Filter
        // event.  This class uses a weak reference to the CollectionViewSource
        // to break the chain and avoid a leak (bug 123012)
        private class FilterStub
        {
            public FilterStub(CollectionViewSource parent)
            {
                _parent = new WeakReference(parent);
                _filterWrapper = new Predicate<Object>(WrapFilter);
            }
 
            public Predicate<Object> FilterWrapper
            {
                get { return _filterWrapper; }
            }
 
            boolean WrapFilter(Object item)
            {
                CollectionViewSource parent = (CollectionViewSource)_parent.Target;
                if (parent != null)
                {
                    return parent.WrapFilter(item);
                }
                else
                {
                    return true;
                }
            }
 
            WeakReference _parent;
            Predicate<Object> _filterWrapper;
        }
  
//        #endregion Private Types
 
//        #region Private Data
  
        //
        //  Private Data
        //
 
        // properties that get forwarded to the view
        CultureInfo                             _culture;
        SortDescriptionCollection               _sort;
        ObservableCollection<GroupDescription>  _groupBy;
  
        // other state
        boolean                _isInitializing;
        boolean                _isViewInitialized; // view is initialized when it is first retrieved externally
        int                 _version;       // timestamp of last change to a forwarded property
        int                 _deferLevel;    // counts nested calls to BeginDefer
        DataSourceProvider  _dataProvider;  // DataSourceProvider whose DataChanged event we want
        FilterStub          _filterStub;    // used to support the Filter event
 
        // Fields to implement DO's inheritance context
        DependencyObject    _inheritanceContext;
        boolean                _hasMultipleInheritanceContexts;
        DependencyProperty  _propertyForInheritanceContext;
 
        // the placeholder source for all default views
         static final CollectionViewSource DefaultSource = new CollectionViewSource();
 
        // This uncommon field is used to store the handlers for the Filter event
        private  static final UncommonField<FilterEventHandler> FilterHandlersField = new UncommonField<FilterEventHandler>();
 
//        #endregion Private Data
    }
}
