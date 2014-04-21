/**
 * CollectionViewSource
 */

define(["dojo/_base/declare", "system/Type",
        "windows/DependencyObject", "componentmodel/ISupportInitialize", "windows/IWeakEventListener",
        "windows/FrameworkPropertyMetadata", "componentmodel/IListSource", "internal.data/DataBindEngine",
        "windows/UncommonField", "system/IDisposable"], 
		function(declare, Type,
				DependencyObject, ISupportInitialize, IWeakEventListener,
				FrameworkPropertyMetadata, IListSource, DataBindEngine,
				UncommonField, IDisposable){ 
	
//    private class 
	var DeferHelper = declare(IDisposable,
    { 
        constructor:function(/*CollectionViewSource*/ target) 
        {
            this._target = target; 
            this._target.BeginDefer();
        },

//        public void 
		Dispose:function() 
        {
            if (this._target != null) 
            { 
                /*CollectionViewSource*/var target = this._target;
                this._target = null; 
                target.EndDefer();
            }
//            GC.SuppressFinalize(this);
        } 

//        private CollectionViewSource _target; 
    }); 

    // This class is used to break the reference chain from a collection 
    // view to a UI element (typically Window or Page), created when the
    // app adds a handler (belonging to the Window or Page) to the Filter
    // event.  This class uses a weak reference to the CollectionViewSource
    // to break the chain and avoid a leak (bug 123012) 
//    private class 
	var FilterStub = declare(null, 
    { 
        constructor:function(/*CollectionViewSource*/ parent) 
        {
            this._parent = parent; //new WeakReference(parent); 
            this._filterWrapper = new Predicate/*<object>*/(this.WrapFilter);
        },

//        bool 
        WrapFilter:function(/*object*/ item) 
        {
            /*CollectionViewSource*/var parent = this._parent; //(CollectionViewSource)_parent.Target;
            if (parent != null)
            { 
                return parent.WrapFilter(item);
            } 
            else 
            {
                return true; 
            }
        }

//        WeakReference _parent; 
//        Predicate<object> _filterWrapper;
    }); 
	
	Object.defineProperties(FilterStub.prototype, {
//      public Predicate<object> 
		FilterWrapper: 
        {
            get:function() { return this._filterWrapper; } 
        } 
	});

	
	var CollectionViewProxy = null;
	function EnsureCollectionViewProxy(){
		if(CollectionViewProxy==null){
			CollectionViewProxy = using("internal.data/CollectionViewProxy");
		}
		return  CollectionViewProxy;
	}
	
	
    // This uncommon field is used to store the handlers for the Filter event 
//    private  static readonly UncommonField<FilterEventHandler> 
	var FilterHandlersField = new UncommonField/*<FilterEventHandler>*/();
	
	var CollectionViewSource = declare("CollectionViewSource", null,{
        /// <summary> 
        ///     Initializes a new instance of the CollectionViewSource class.
        /// </summary>
		constructor:function( ){
            this._sort = new SortDescriptionCollection();
            this._sort.CollectionChanged.Combine(NotifyCollectionChangedEventHandler(this, this.OnForwardedCollectionChanged));
 
            this._groupBy = new ObservableCollection/*<GroupDescription>*/();
            this._groupBy.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnForwardedCollectionChanged)); 
            
            
            // properties that get forwarded to the view 
//            CultureInfo                             
            this._culture = null;
//            ObservableCollection<string>            
            this._liveSortingProperties = null;
//            ObservableCollection<string>            
            this._liveFilteringProperties = null;
//            ObservableCollection<string>            
            this._liveGroupingProperties = null; 

            // other state 
//            bool                
            this._isInitializing = false; 
//            bool                
            this._isViewInitialized = false; // view is initialized when it is first retrieved externally
//            int                 
            this._version = 0;       // timestamp of last change to a forwarded property 
//            int                 
            this._deferLevel = 0;    // counts nested calls to BeginDefer
//            DataSourceProvider  
            this._dataProvider = null;  // DataSourceProvider whose DataChanged event we want
//            FilterStub          
            this._filterStub = null;    // used to support the Filter event
     
            // Fields to implement DO's inheritance context
//            DependencyObject    
            this._inheritanceContext = null; 
//            bool                
            this._hasMultipleInheritanceContexts = false; 
//            DependencyProperty  
            this._propertyForInheritanceContext = null;
		},

        /// <summary> 
        ///     This method is invoked when the Source property changes.
        /// </summary>
        /// <param name="oldSource">The old value of the Source property.</param>
        /// <param name="newSource">The new value of the Source property.</param> 
//        protected virtual void 
        OnSourceChanged:function(/*object*/ oldSource, /*object*/ newSource)
        { 
        },

        /// <summary> 
        ///     This method is invoked when the CollectionViewType property changes.
        /// </summary> 
        /// <param name="oldCollectionViewType">The old value of the CollectionViewType property.</param> 
        /// <param name="newCollectionViewType">The new value of the CollectionViewType property.</param>
//        protected virtual void 
        OnCollectionViewTypeChanged:function(/*Type*/ oldCollectionViewType, /*Type*/ newCollectionViewType) 
        {
        },


        /// <summary>
        /// Enter a Defer Cycle.
        /// Defer cycles are used to coalesce changes to the ICollectionView. 
        /// </summary>
//        public IDisposable 
        DeferRefresh:function() 
        { 
            return new DeferHelper(this);
        }, 
        
        /// <summary>Signals the object that initialization is starting.</summary>
//        void ISupportInitialize.
        BeginInit:function()
        {
            this._isInitializing = true; 
        },
 
        /// <summary>Signals the object that initialization is complete.</summary> 
//        void ISupportInitialize.
        EndInit:function()
        { 
            this._isInitializing = false;
            this.EnsureView();
        },

        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary>
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        { 
            return false;   // this method is no longer used (but must remain, for compat) 
        },
 
	 
        // Receive a new inheritance context (this will be a FE/FCE) 
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        { 
            // remember which property caused the context - BindingExpression wants to know
            // (this must happen before calling AddInheritanceContext, so that the answer
            // is ready during the InheritanceContextChanged event)
            if (!this._hasMultipleInheritanceContexts && this._inheritanceContext == null) 
            {
            	this._propertyForInheritanceContext = property; 
            } 
            else
            { 
            	this._propertyForInheritanceContext = null;
            }
    		
        	var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.AddInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;    		
        },
        // Remove an inheritance context (this will be a FE/FCE)
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property)
        {
//            InheritanceContextHelper.RemoveInheritanceContext(context, 
//                                                                  this,
//                                                                  ref _hasMultipleInheritanceContexts, 
//                                                                  ref _inheritanceContext); 
            
        	var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.RemoveInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;     		

            // after removing a context, we don't know which property caused it 
            this._propertyForInheritanceContext = null;
        },


//        internal bool 
        IsShareableInTemplate:function()
        { 
            return false;
        },
 
        // Obtain the view affiliated with the current source.  This may create 
        // a new view, or re-use an existing one.
//        void 
//        EnsureView:function() 
//        {
//            EnsureView(Source, CollectionViewType);
//        },
 
//        void 
        EnsureView:function(/*object*/ source, /*Type*/ collectionViewType)
        { 
        	var source , collectionViewType;
        	if(source === undefined){
        		var source = this.Source;
        	}
        	
        	if(collectionViewType === undefined){
        		var collectionViewType = this.CollectionViewType;
        	}
        	
            if (this._isInitializing || this._deferLevel > 0) 
                return;
 
            /*DataSourceProvider*/var dataProvider = source instanceof DataSourceProvider ? source : null;

            // listen for DataChanged events from an DataSourceProvider
            if (dataProvider != this._dataProvider) 
            {
                if (this._dataProvider != null) 
                { 
                    DataChangedEventManager.RemoveHandler(_dataProvider, OnDataChanged);
                } 

                this._dataProvider = dataProvider;

                if (this._dataProvider != null) 
                {
                    DataChangedEventManager.AddHandler(this._dataProvider, OnDataChanged); 
                    this._dataProvider.InitialLoad(); 
                }
            } 

            // if the source is DataSourceProvider, use its Data instead
            if (dataProvider != null)
            { 
                source = dataProvider.Data;
            } 
 
            // get the view
            /*ICollectionView*/var view = null; 

            if (source != null)
            {
                var engine = DataBindEngine.CurrentDataBindEngine; 
                /*ViewRecord*/var viewRecord = engine.GetViewRecord(source, this, collectionViewType, true
                	,/*(object x) =>*/ function(x)
                    { 
                        /*BindingExpressionBase*/var beb = BindingOperations.GetBindingExpressionBase(this, CollectionViewSource.SourceProperty);
                        return (beb != null) ? beb.GetSourceItem(x) : null; 
                    }
                    
                );

                if (viewRecord != null)
                { 
                    view = viewRecord.View;
                    this._isViewInitialized = viewRecord.IsInitialized; 
 
                    // bring view up to date with the CollectionViewSource
                    if (this._version != viewRecord.Version) 
                    {
                    	this.ApplyPropertiesToView(view);
                        viewRecord.Version = _version;
                    } 
                }
            } 
 
            // update the View property
            this.SetValue(CollectionViewSource.ViewPropertyKey, view); 
        },

        // Forward properties from the CollectionViewSource to the CollectionView
//        void 
        ApplyPropertiesToView:function(/*ICollectionView*/ view) 
        {
            if (view == null || this._deferLevel > 0) 
                return; 

            /*ICollectionViewLiveShaping*/var liveView = view instanceof ICollectionViewLiveShaping ? view : null; 

//            using (view.DeferRefresh())
//            {
            var disposable = view.DeferRefresh();
            try{
                var i, n; 

                // Culture 
                if (this.Culture != null) 
                {
                    view.Culture = this.Culture; 
                }

                // Sort
                if (view.CanSort) 
                {
                    view.SortDescriptions.Clear(); 
                    for (i=0, n=this.SortDescriptions.Count;  i < n;  ++i) 
                    {
                        view.SortDescriptions.Add(this.SortDescriptions[i]); 
                    }
                }
                else if (this.SortDescriptions.Count > 0)
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotSortView, view)'); 

                // Filter 
                /*Predicate<object>*/var filter; 
                if (FilterHandlersField.GetValue(this) != null)
                { 
                    filter = this.FilterWrapper;
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
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotFilterView, view)'); 

                // GroupBy 
                if (view.CanGroup) 
                {
                    view.GroupDescriptions.Clear(); 
                    for (i=0, n=this.GroupDescriptions.Count;  i < n;  ++i)
                    {
                        view.GroupDescriptions.Add(this.GroupDescriptions[i]);
                    } 
                }
                else if (this.GroupDescriptions.Count > 0) 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotGroupView, view)'); 

                // Live shaping 
                if (liveView != null)
                {
                    /*ObservableCollection<string>*/var properties;
 
                    // sorting
                    if (liveView.CanChangeLiveSorting) 
                    { 
                        liveView.IsLiveSorting = this.IsLiveSortingRequested;
                        properties = liveView.LiveSortingProperties; 
                        properties.Clear();

                        if (this.IsLiveSortingRequested)
                        { 
//                            foreach (string s in LiveSortingProperties)
//                            { 
//                                properties.Add(s); 
//                            }
                        	for(i=0; i<this.LiveSortingProperties.Count; i++){
                        		properties.Add(this.LiveSortingProperties.Get(i)); 
                        	}
                        } 
                    }

                    this.CanChangeLiveSorting = liveView.CanChangeLiveSorting;
                    this.IsLiveSorting = liveView.IsLiveSorting; 

                    // filtering 
                    if (liveView.CanChangeLiveFiltering) 
                    {
                        liveView.IsLiveFiltering = this.IsLiveFilteringRequested; 
                        properties = liveView.LiveFilteringProperties;
                        properties.Clear();

                        if (this.IsLiveFilteringRequested) 
                        {
//                            foreach (string s in LiveFilteringProperties) 
//                            { 
//                                properties.Add(s);
//                            } 
                         	for(i=0; i<this.LiveFilteringProperties.Count; i++){
                        		properties.Add(this.LiveFilteringProperties.Get(i)); 
                        	}
                        }
                    }

                    this.CanChangeLiveFiltering = liveView.CanChangeLiveFiltering; 
                    this.IsLiveFiltering = liveView.IsLiveFiltering;
 
                    // grouping 
                    if (liveView.CanChangeLiveGrouping)
                    { 
                        liveView.IsLiveGrouping = this.IsLiveGroupingRequested;
                        properties = liveView.LiveGroupingProperties;
                        properties.Clear();
 
                        if (this.IsLiveGroupingRequested)
                        { 
//                            foreach (string s in LiveGroupingProperties) 
//                            {
//                                properties.Add(s); 
//                            }
                         	for(i=0; i<this.LiveGroupingProperties.Count; i++){
                        		properties.Add(this.LiveGroupingProperties.Get(i)); 
                        	}
                        }
                    }
 
                    this.CanChangeLiveGrouping = liveView.CanChangeLiveGrouping;
                    this.IsLiveGrouping = liveView.IsLiveGrouping; 
                } 
                else
                { 
                    this.CanChangeLiveSorting = false;
                    this.IsLiveSorting = null;
                    this.CanChangeLiveFiltering = false;
                    this.IsLiveFiltering = null; 
                    this.CanChangeLiveGrouping = false;
                    this.IsLiveGrouping = null; 
                } 
            }finally{
            	disposable.Dispose();
            }
        }, 
        
//        bool 
        WrapFilter:function(/*object*/ item)
        {
            /*FilterEventArgs*/var args = new FilterEventArgs(item);
            /*FilterEventHandler*/var handlers = FilterHandlersField.GetValue(this); 

            if (handlers != null) 
            { 
                handlers.Invoke(this, args);
            } 

            return args.Accepted;
        },
 
//        void 
        OnDataChanged:function(/*object*/ sender, /*EventArgs*/ e)
        { 
            this.EnsureView(); 
        },
 
        // a change occurred in one of the collections that we forward to the view
//        void 
        OnForwardedCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        {
            this.OnForwardedPropertyChanged(); 
        },
 
        // a change occurred in one of the properties that we forward to the view 
//        void 
        OnForwardedPropertyChanged:function()
        { 
            // increment the version number.  This causes the change to get applied
            // to dormant views when they become active.
            ++ this._version; //unchecked {++ _version;}
 
            // apply the change to the current view
            this.ApplyPropertiesToView(View); 
        },

        // defer changes 
//        void 
        BeginDefer:function()
        {
            ++ this._deferLevel;
        },

//        void 
        EndDefer:function() 
        { 
            if (--this._deferLevel == 0)
            { 
                this.EnsureView();
            }
        }

	});
	
	Object.defineProperties(CollectionViewSource.prototype,{

        /// <summary>
        ///     Returns the ICollectionView currently affiliated with this CollectionViewSource. 
        /// </summary>
//        [ReadOnly(true)] 
//        public ICollectionView 
        View: 
        {
            get:function()
            {
                return CollectionViewSource.GetOriginalView(this.CollectionView);
            }
        }, 
 
        /// <summary>
        ///     Source is the underlying collection. 
        /// </summary> 
//        public object 
        Source:
        { 
            get:function() { return  this.GetValue(CollectionViewSource.SourceProperty); },
            set:function(value) { this.SetValue(CollectionViewSource.SourceProperty, value); }
        },
 
        /// <summary>
        ///     CollectionViewType is the desired type of the View. 
        /// </summary> 
        /// <remarks>
        ///     This property may only be set during initialization. 
        /// </remarks>
//        public Type 
        CollectionViewType:
        {
            get:function() { return /*(Type)*/ GetValue(CollectionViewSource.CollectionViewTypeProperty); }, 
            set:function(value) { SetValue(CollectionViewSource.CollectionViewTypeProperty, value); }
        }, 
        ///<summary> 
        /// Gets a value that indicates whether the underlying view allows
        /// turning live sorting on or off. 
        ///</summary>
//        public bool 
        CanChangeLiveSorting:
        { 
            get:function() { return this.GetValue(CollectionViewSource.CanChangeLiveSortingProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.CanChangeLiveSortingPropertyKey, value); } 
        }, 
        /// <summary>
        /// CultureInfo used for sorting, comparisons, etc. 
        /// This property is forwarded to any collection view created from this source.
        /// </summary> 
//        [TypeConverter(typeof(System.Windows.CultureInfoIetfLanguageTagConverter))] 
//        public CultureInfo 
        Culture:
        { 
            get:function() { return this._culture; },
            set:function(value) { this._culture = value; this.OnForwardedPropertyChanged(); }
        },
 
        /// <summary>
        /// Collection of SortDescriptions, describing sorting. 
        /// This property is forwarded to any collection view created from this source. 
        /// </summary>
//        public SortDescriptionCollection 
        SortDescriptions:
        {
            get:function() { return this._sort; }
        },
 
        /// <summary>
        /// Collection of GroupDescriptions, describing grouping. 
        /// This property is forwarded to any collection view created from this source. 
        /// </summary>
//        public ObservableCollection<GroupDescription> 
        GroupDescriptions: 
        {
            get:function() { return this._groupBy; }
        },

        ///<summary> 
        /// Gets or sets a value that the CollectionViewSource will use to
        /// set the IsLiveSorting property of its views, when possible. 
        ///</summary> 
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping and 
        /// its CanChangeLiveSortingProperty is true, this property is used to
        /// set the view's IsLiveSorting property.
        ///</notes>
//        public bool 
        IsLiveSortingRequested:
        {
            get:function() { return this.GetValue(CollectionViewSource.IsLiveSortingRequestedProperty); },
            set:function(value) { this.SetValue(CollectionViewSource.IsLiveSortingRequestedProperty, value); } 
        },
 
        ///<summary>
        /// Gets a value that indicates whether live sorting is enabled for the 
        /// underlying view.
        ///</summary>
        ///<notes>
        /// The value is null if the view does not implement ICollectionViewLiveShaping, 
        /// or if it cannot tell whether it is live-sorting.
        ///</notes> 
//        [ReadOnly(true)] 
//        public bool? 
        IsLiveSorting:
        { 
            get:function() { return this.GetValue(CollectionViewSource.IsLiveSortingProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.IsLiveSortingPropertyKey, value); }
        },
 
        ///<summary>
        /// Gets a collection of strings describing the properties that 
        /// trigger a live-sorting recalculation. 
        /// The strings use the same format as SortDescription.PropertyName.
        ///</summary> 
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping,
        /// this collection is used to set the underlying view's LiveSortingProperties.
        /// When this collection is empty, the view will use the PropertyName strings 
        /// from its SortDescriptions.
        ///</notes> 
//        public ObservableCollection<string> 
        LiveSortingProperties:
        {
            get:function() 
            {
                if (this._liveSortingProperties == null)
                {
                    this._liveSortingProperties = new ObservableCollection/*<string>*/(); 
                    this._liveSortingProperties.CollectionChanged.Combine(
                    		new NotifyCollectionChangedEventHandler(this, this.OnForwardedCollectionChanged));
                } 
                return this._liveSortingProperties; 
            }
        }, 


        ///<summary> 
        /// Gets a value that indicates whether the underlying view allows
        /// turning live Filtering on or off. 
        ///</summary> 
//        [ReadOnly(true)]
//        public bool 
        CanChangeLiveFiltering:
        {
            get:function() { return this.GetValue(CollectionViewSource.CanChangeLiveFilteringProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.CanChangeLiveFilteringPropertyKey, value); }
        }, 

        ///<summary>
        /// Gets or sets a value that the CollectionViewSource will use to
        /// set the IsLiveFiltering property of its views, when possible.
        ///</summary> 
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping and 
        /// its CanChangeLiveFilteringProperty is true, this property is used to 
        /// set the view's IsLiveFiltering property.
        ///</notes> 
//        public bool 
        IsLiveFilteringRequested:
        {
            get:function() { return this.GetValue(CollectionViewSource.IsLiveFilteringRequestedProperty); },
            set:function(value) { this.SetValue(CollectionViewSource.IsLiveFilteringRequestedProperty, value); } 
        },

        ///<summary>
        /// Gets a value that indicates whether live Filtering is enabled for the 
        /// underlying view. 
        ///</summary>
        ///<notes> 
        /// The value is null if the view does not implement ICollectionViewLiveShaping,
        /// or if it cannot tell whether it is live-Filtering.
        ///</notes>
//        [ReadOnly(true)] 
//        public bool? 
        IsLiveFiltering:
        { 
            get:function() { return /*(bool?)*/this.GetValue(CollectionViewSource.IsLiveFilteringProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.IsLiveFilteringPropertyKey, value); }
        },

        ///<summary>
        /// Gets a collection of strings describing the properties that
        /// trigger a live-filtering recalculation. 
        /// The strings use the same format as SortDescription.PropertyName.
        ///</summary> 
        ///<notes> 
        /// When the underlying view implements ICollectionViewLiveShaping,
        /// this collection is used to set the underlying view's LiveFilteringProperties. 
        ///</notes>
//        public ObservableCollection<string> 
        LiveFilteringProperties:
        {
            get:function()
            {
                if (this._liveFilteringProperties == null) 
                { 
                    this._liveFilteringProperties = new ObservableCollection/*<string>*/();
                    this._liveFilteringProperties.CollectionChanged.Combine(
                    		new NotifyCollectionChangedEventHandler(this, this.OnForwardedCollectionChanged)); 
                }
                return this._liveFilteringProperties;
            }
        },

        ///<summary>
        /// Gets a value that indicates whether the underlying view allows 
        /// turning live Grouping on or off.
        ///</summary>
//        [ReadOnly(true)]
//        public bool 
        CanChangeLiveGrouping:
        {
            get:function() { return this.GetValue(CollectionViewSource.CanChangeLiveGroupingProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.CanChangeLiveGroupingPropertyKey, value); } 
        },
 
 
        ///<summary>
        /// Gets or sets a value that the CollectionViewSource will use to 
        /// set the IsLiveGrouping property of its views, when possible. 
        ///</summary>
        ///<notes> 
        /// When the underlying view implements ICollectionViewLiveShaping and
        /// its CanChangeLiveGroupingProperty is true, this property is used to
        /// set the view's IsLiveGrouping property.
        ///</notes> 
//        public bool 
        IsLiveGroupingRequested:
        { 
            get:function() { return this.GetValue(CollectionViewSource.IsLiveGroupingRequestedProperty); }, 
            set:function(value) { this.SetValue(CollectionViewSource.IsLiveGroupingRequestedProperty, value); }
        },

        ///<summary> 
        /// Gets a value that indicates whether live Grouping is enabled for the
        /// underlying view.
        ///</summary>
        ///<notes> 
        /// The value is null if the view does not implement ICollectionViewLiveShaping,
        /// or if it cannot tell whether it is live-Grouping. 
        ///</notes> 
//        [ReadOnly(true)]
//        public bool? 
        IsLiveGrouping: 
        {
            get:function() { return this.GetValue(CollectionViewSource.IsLiveGroupingProperty); },
            /*private*/ set:function(value) { this.SetValue(CollectionViewSource.IsLiveGroupingPropertyKey, value); }
        },

        ///<summary> 
        /// Gets a collection of strings describing the properties that 
        /// trigger a live-grouping recalculation.
        /// The strings use the same format as PropertyGroupDescription.PropertyName. 
        ///</summary>
        ///<notes>
        /// When the underlying view implements ICollectionViewLiveShaping,
        /// this collection is used to set the underlying view's LiveGroupingProperties. 
        ///</notes>
//        public ObservableCollection<string> 
        LiveGroupingProperties: 
        { 
            get:function()
            { 
                if (this._liveGroupingProperties == null)
                {
                    this._liveGroupingProperties = new ObservableCollection/*<string>*/();
                    this._liveGroupingProperties.CollectionChanged.Combine(
                    		new NotifyCollectionChangedEventHandler(this, this.OnForwardedCollectionChanged));
                }
                return this._liveGroupingProperties; 
            } 
        },
 
        /// <summary>
        ///     An event requesting a filter query. 
        /// </summary> 
//        public event FilterEventHandler 
        Filter:
        { 
        	get:function(){},
        	set:function(value){}
//            add
//            {
//                // Get existing event hanlders
//                FilterEventHandler handlers = FilterHandlersField.GetValue(this); 
//                if (handlers != null)
//                { 
//                    // combine to a multicast delegate 
//                    handlers = (FilterEventHandler)Delegate.Combine(handlers, value);
//                } 
//                else
//                {
//                    handlers = value;
//                } 
//                // Set the delegate as an uncommon field
//                FilterHandlersField.SetValue(this, handlers); 
// 
//                OnForwardedPropertyChanged();
//            } 
//            remove
//            {
//                // Get existing event hanlders
//                FilterEventHandler handlers = FilterHandlersField.GetValue(this); 
//                if (handlers != null)
//                { 
//                    // Remove the given handler 
//                    handlers = (FilterEventHandler)Delegate.Remove(handlers, value);
//                    if (handlers == null) 
//                    {
//                        // Clear the value for the uncommon field
//                        // cause there are no more handlers
//                        FilterHandlersField.ClearValue(this); 
//                    }
//                    else 
//                    { 
//                        // Set the remaining handlers as an uncommon field
//                        FilterHandlersField.SetValue(this, handlers); 
//                    }
//                }
//
//                OnForwardedPropertyChanged(); 
//            }
        },

        // Returns the CollectionView currently affiliate with this CollectionViewSource. 
        // This may be a CollectionViewProxy over the original view. 
//        internal CollectionView 
        CollectionView:
        { 
            get:function()
            {
                var view = /*(ICollectionView)*/this.GetValue(CollectionViewSource.ViewProperty);
 
                if (view != null && !this._isViewInitialized)
                { 
                    // leak prevention: re-fetch ViewRecord instead of keeping a reference to it, 
                    // to be sure that we don't inadvertently keep it alive.
                    var source = this.Source; 
                    /*DataSourceProvider*/var dataProvider = source instanceof DataSourceProvider ? source : null;

                    // if the source is DataSourceProvider, use its Data instead
                    if (dataProvider != null) 
                    {
                        source = dataProvider.Data; 
                    } 

                    if (source != null) 
                    {
                        /*DataBindEngine*/var engine = DataBindEngine.CurrentDataBindEngine;
                        /*ViewRecord*/var viewRecord = engine.GetViewRecord(source, this, this.CollectionViewType, true, null);
                        if (viewRecord != null) 
                        {
                            viewRecord.InitializeView(); 
                            this._isViewInitialized = true; 
                        }
                    } 
                }

                return /*(CollectionView)*/view;
            } 
        },
 
        // Returns the property through which inheritance context was established 
//        internal DependencyProperty 
        PropertyForInheritanceContext:
        { 
            get:function() { return this._propertyForInheritanceContext; }
        },

        // Define the DO's inheritance context
//        internal override DependencyObject 
        InheritanceContext:
        {
            get:function() { return this._inheritanceContext; } 
        },
 

        // Says if the current instance has multiple InheritanceContexts 
//        internal override bool 
        HasMultipleInheritanceContexts:
        { 
            get:function() { return this._hasMultipleInheritanceContexts; } 
        },
 

//        Predicate<object> 
        FilterWrapper: 
        { 
            get:function()
            { 
                if (this._filterStub == null)
                {
                	this._filterStub = new FilterStub(this);
                } 

                return this._filterStub.FilterWrapper; 
            } 
        }
	});
	
	Object.defineProperties(CollectionViewSource, {
        /// <summary>
        ///     The key needed to define a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
        ViewPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._viewPropertyKey === undefined){

	        		CollectionViewSource._viewPropertyKey = DependencyProperty.RegisterReadOnly( 
	                        "View", 
	                        ICollectionView.Type,
	                        CollectionViewSource.Type, 
	                        /*new FrameworkPropertyMetadata((ICollectionView)null)*/
	                        FrameworkPropertyMetadata.BuildWithDV(null));
        		}
        		
        		return CollectionViewSource._viewPropertyKey;
        	}
        },
        /// <summary>
        ///     The DependencyProperty for the View property. 
        ///     Flags:              None
        ///     Other:              Read-Only 
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        ViewProperty: {
            get:function(){
            	return CollectionViewSource.ViewPropertyKey.DependencyProperty;
            }
        },
 
        /// <summary>
        ///     The DependencyProperty for the Source property. 
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        SourceProperty:{
        	get:function(){
        		if(CollectionViewSource._sourceProperty === undefined){

        		CollectionViewSource._sourceProperty = DependencyProperty.Register(
                        "Source", 
                        Object.Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                /*(object)*/null,
                                new PropertyChangedCallback(null, OnSourceChanged)),
                        new ValidateValueCallback(null, IsSourceValid));
        		}
        	}
        },
        /// <summary>
        ///     The DependencyProperty for the CollectionViewType property. 
        ///     Flags:              none
        ///     Default Value:      null
        /// </summary>
//        public static readonly DependencyProperty 
        CollectionViewTypeProperty:{
        	get:function(){
        		if(CollectionViewSource._collectionViewTypeProperty === undefined){

        		CollectionViewSource._collectionViewTypeProperty= DependencyProperty.Register(
                        "CollectionViewType", 
                        Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDVandPCCB( 
                                /*(Type)*/null,
                                new PropertyChangedCallback(null, OnCollectionViewTypeChanged)),
                        new ValidateValueCallback(null, IsCollectionViewTypeValid));
        		}
        	}
        },
        /// <summary> 
        ///     The key needed to define a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey
        CanChangeLiveSortingPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._viewPropertyKey === undefined){

        		CollectionViewSource._viewPropertyKey = DependencyProperty.RegisterReadOnly(
                        "CanChangeLiveSorting",
                        Boolean.Type,
                        CollectionViewSource.Type, 
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool)*/false));

        		}
        	}
        },
 
        /// <summary> 
        ///     The DependencyProperty for the CanChangeLiveSorting property.
        ///     Flags:              None 
        ///     Other:              Read-Only
        ///     Default Value:      false
        /// </summary>
//        public static readonly DependencyProperty
        CanChangeLiveSortingProperty:{
            get:function(){
            	return CollectionViewSource.CanChangeLiveSortingPropertyKey.DependencyProperty;
            }
        },
        /// <summary> 
        ///     The DependencyProperty for the IsLiveSortingRequested property.
        ///     Flags:              None
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        IsLiveSortingRequestedProperty:{
        	get:function(){
        		if(CollectionViewSource._isLiveSortingRequestedProperty === undefined){

        		CollectionViewSource._isLiveSortingRequestedProperty= DependencyProperty.Register( 
                        "IsLiveSortingRequested", 
                        Boolean.Type,
                        CollectionViewSource.Type, 
                        /*new FrameworkPropertyMetadata((bool)false,
                            new PropertyChangedCallback(null, OnIsLiveSortingRequestedChanged))*/
                        FrameworkPropertyMetadata.BuildWithDVandPCCB(
                        		false,
                                new PropertyChangedCallback(null, OnIsLiveSortingRequestedChanged)));
        		}
        	}
        },

 
        /// <summary> 
        ///     The key needed to define a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
        IsLiveSortingPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._viewPropertyKey === undefined){

        		CollectionViewSource._viewPropertyKey = DependencyProperty.RegisterReadOnly(
                        "IsLiveSorting",
                        Boolean.Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool?)*/false)); 
        		}
        	}
        },
 
        /// <summary>
        ///     The DependencyProperty for the IsLiveSorting property. 
        ///     Flags:              None
        ///     Other:              Read-Only
        ///     Default Value:      null
        /// </summary> 
//        public static readonly DependencyProperty 
        IsLiveSortingProperty:{
            get:function(){
            	return CollectionViewSource.IsLiveSortingPropertyKey.DependencyProperty;
            }
        },
 


        /// <summary>
        ///     The key needed to define a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
        CanChangeLiveFilteringPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._canChangeLiveFilteringPropertyKey === undefined){

        		CollectionViewSource._canChangeLiveFilteringPropertyKey= DependencyProperty.RegisterReadOnly( 
                        "CanChangeLiveFiltering",
                        Boolean.Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool)*/false));
        		}
        	}
        },

        /// <summary> 
        ///     The DependencyProperty for the CanChangeLiveFiltering property.
        ///     Flags:              None 
        ///     Other:              Read-Only 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        CanChangeLiveFilteringProperty:{
            get:function(){
            	return CollectionViewSource.CanChangeLiveFilteringPropertyKey.DependencyProperty;
            }
        },
        /// <summary> 
        ///     The DependencyProperty for the IsLiveFilteringRequested property. 
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
        IsLiveFilteringRequestedProperty:{
        	get:function(){
        		if(CollectionViewSource._isLiveFilteringRequestedProperty === undefined){

        		CollectionViewSource._isLiveFilteringRequestedProperty = DependencyProperty.Register(
                        "IsLiveFilteringRequested", 
                        Boolean.Type,
                        CollectionViewSource.Type, 
                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(bool)*/false, 
                            new PropertyChangedCallback(null, OnIsLiveFilteringRequestedChanged)));
        		}
        	}
		},
 

        /// <summary> 
        ///     The key needed to define a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
        IsLiveFilteringPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._isLiveFilteringPropertyKey === undefined){

        		CollectionViewSource._isLiveFilteringPropertyKey= DependencyProperty.RegisterReadOnly(
                        "IsLiveFiltering", 
                        Boolean.Type,
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool?)*/false));
        		}
        	}
            
        },
        /// <summary>
        ///     The DependencyProperty for the IsLiveFiltering property. 
        ///     Flags:              None 
        ///     Other:              Read-Only
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        IsLiveFilteringProperty:{
            get:function(){
            	return CollectionViewSource.IsLiveFilteringPropertyKey.DependencyProperty;
            }
		}, 
        /// <summary> 
        ///     The key needed to define a read-only property.
        /// </summary> 
//        private static readonly DependencyPropertyKey 
        CanChangeLiveGroupingPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._canChangeLiveGroupingPropertyKey === undefined){

        		CollectionViewSource._canChangeLiveGroupingPropertyKey= DependencyProperty.RegisterReadOnly(
                        "CanChangeLiveGrouping",
                        Boolean.Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool)*/false)); 
        		}
        	}
        },
 
        /// <summary>
        ///     The DependencyProperty for the CanChangeLiveGrouping property. 
        ///     Flags:              None
        ///     Other:              Read-Only
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        CanChangeLiveGroupingProperty:{
            get:function(){
            	return CollectionViewSource.CanChangeLiveGroupingPropertyKey.DependencyProperty;
            }
		}, 
        /// <summary>
        ///     The DependencyProperty for the IsLiveGroupingRequested property.
        ///     Flags:              None
        ///     Default Value:      false 
        /// </summary>
//        public static readonly DependencyProperty 
        IsLiveGroupingRequestedProperty:{
        	get:function(){
        		if(CollectionViewSource._isLiveGroupingRequestedProperty === undefined){

        			CollectionViewSource._isLiveGroupingRequestedProperty = DependencyProperty.Register( 
                        "IsLiveGroupingRequested",
                        Boolean.Type, 
                        CollectionViewSource.Type,
                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(bool)*/false,
                            new PropertyChangedCallback(null, OnIsLiveGroupingRequestedChanged)));
        		}
        	}
            
        },
        /// <summary>
        ///     The key needed to define a read-only property. 
        /// </summary>
//        private static readonly DependencyPropertyKey 
        IsLiveGroupingPropertyKey:{
        	get:function(){
        		if(CollectionViewSource._isLiveGroupingPropertyKey === undefined){

        		CollectionViewSource._isLiveGroupingPropertyKey = DependencyProperty.RegisterReadOnly(
                        "IsLiveGrouping", 
                        Boolean.Type,
                        CollectionViewSource.Type, 
                        FrameworkPropertyMetadata.BuildWithDV(/*(bool?)*/false)); 
        		}
        	}
        },    

        /// <summary> 
        ///     The DependencyProperty for the IsLiveGrouping property.
        ///     Flags:              None
        ///     Other:              Read-Only
        ///     Default Value:      null 
        /// </summary>
//        public static readonly DependencyProperty 
        IsLiveGroupingProperty:{
            get:function(){
            	return CollectionViewSource.IsLiveGroupingPropertyKey.DependencyProperty;
            }
        },
        
        // the placeholder source for all default views
//        internal static readonly CollectionViewSource 
        DefaultSource:
        {	
        	get:function(){
        		if(CollectionViewSource._defaultSource === undefined){
        			CollectionViewSource._defaultSource= new CollectionViewSource();
        		}
        		
        		return CollectionViewSource._defaultSource;
        	}
        },
        
        
        // This uncommon field is used to store the handlers for the Filter event 
//        private  static readonly UncommonField<FilterEventHandler> 
        FilterHandlersField:
        {
        	get:function(){
        		if(CollectionViewSource._filterHandlersField === undefined){
        			CollectionViewSource._filterHandlersField= new UncommonField/*<FilterEventHandler>*/();
        		}
        		
        		return CollectionViewSource._filterHandlersField;
        	}
        }

	});
	
	 /// <summary>
    ///     Called when SourceProperty is invalidated on "d." 
    /// </summary> 
    /// <param name="d">The object on which the property was invalidated.</param>
    /// <param name="e">Argument.</param> 
//    private static void 
    function OnSourceChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*CollectionViewSource*/var ctrl = /*(CollectionViewSource)*/ d;

        ctrl.OnSourceChanged(e.OldValue, e.NewValue);
        ctrl.EnsureView(); 
    } 


//    private static bool 
    function IsSourceValid(/*object*/ o) 
    {
        return (o == null ||
                    o instanceof IEnumerable ||
                    o instanceof IListSource || 
                    o instanceof DataSourceProvider) &&
                !(o instanceof ICollectionView); 
    } 

//    private static bool 
    function IsValidSourceForView(/*object*/ o) 
    {
        return (o instanceof IEnumerable ||
                o instanceof IListSource);
    } 

//    private static void 
    function OnCollectionViewTypeChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*CollectionViewSource*/var ctrl = /*(CollectionViewSource)*/ d;

        var oldCollectionViewType = /*(Type)*/ e.OldValue;
        var newCollectionViewType = /*(Type)*/ e.NewValue; 

        if (!ctrl._isInitializing) 
            throw new Error('InvalidOperationException(SR.Get(SRID.CollectionViewTypeIsInitOnly)'); 

        ctrl.OnCollectionViewTypeChanged(oldCollectionViewType, newCollectionViewType); 
        ctrl.EnsureView();
    }

//    private static bool 
    function IsCollectionViewTypeValid(/*object*/ o) 
    {
        var type = /*(Type)*/o; 

        return type == null ||
            /*typeof(ICollectionView)*/ICollectionView.Type.IsAssignableFrom(type); 
    }

//    private static void 
    function OnIsLiveSortingRequestedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*CollectionViewSource*/var cvs = /*(CollectionViewSource)*/d;
        cvs.OnForwardedPropertyChanged(); 
    }

//    private static void 
    function OnIsLiveFilteringRequestedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        /*CollectionViewSource*/var cvs = /*(CollectionViewSource)*/d; 
        cvs.OnForwardedPropertyChanged();
    }


//    private static void 
    function OnIsLiveGroupingRequestedChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        var cvs = /*(CollectionViewSource)*/d; 
        cvs.OnForwardedPropertyChanged();
    } 


    /// <summary> 
    /// Return the default view for the given source.  This view is never
    /// affiliated with any CollectionViewSource. 
    /// </summary>
//    public static ICollectionView 
    CollectionViewSource.GetDefaultView = function(/*object*/ source)
    {
        return CollectionViewSource.GetOriginalView(CollectionViewSource.GetDefaultCollectionView(source, true)); 
    };

    // a version of the previous method that doesn't create the view (bug 108595) 
//    private static ICollectionView 
    function LazyGetDefaultView(/*object*/ source)
    { 
        return CollectionViewSource.GetOriginalView(CollectionViewSource.GetDefaultCollectionView(source, false));
    }

    /// <summary> 
    /// Return true if the given view is the default view for its source.
    /// </summary> 
//    public static bool 
    CollectionViewSource.IsDefaultView=function(/*ICollectionView*/ view) 
    {
        if (view != null) 
        {
            var source = view.SourceCollection;
            return (CollectionViewSource.GetOriginalView(view) == LazyGetDefaultView(source));
        } 
        else
        { 
            return true; 
        }
    }; 
    
    // Return the default view for the given source.  This view is never
    // affiliated with any CollectionViewSource.  It may be a 
    // CollectionViewProxy over the original view
//    static internal CollectionView 
    CollectionViewSource.GetDefaultCollectionView = function(/*object*/ source, /*bool createView, DependencyObject d*/ par,
    		/*Func<object, object>*/ GetSourceItem/*=null*/) 
    { 
    	var createView = null;
    	if(typeof(par) =="boolean"){
    		createView= par;
    	}else{
    		createView= true;
    	}
    	
        if (!IsValidSourceForView(source)){
            return null; 
        }

        /*DataBindEngine*/var engine = DataBindEngine.CurrentDataBindEngine;
        /*ViewRecord*/var viewRecord = engine.GetViewRecord(source, 
        		CollectionViewSource.DefaultSource, null, createView, GetSourceItem);

        return (viewRecord != null) ? /*(CollectionView)*/viewRecord.View : null;
    };

//
//    // Return the default view for the given source.  This view is never
//    // affiliated with any CollectionViewSource.  It may be a 
//    // CollectionViewProxy over the original view
//    static internal CollectionView GetDefaultCollectionView(object source, bool createView, Func<object, object> GetSourceItem=null) 
//    { 
//        if (!IsValidSourceForView(source))
//            return null; 
//
//        DataBindEngine engine = DataBindEngine.CurrentDataBindEngine;
//        ViewRecord viewRecord = engine.GetViewRecord(source, DefaultSource, null, createView, GetSourceItem);
//
//        return (viewRecord != null) ? (CollectionView)viewRecord.View : null;
//    } 
//
//    /// <summary>
//    /// Return the default view for the given source.  This view is never 
//    /// affiliated with any CollectionViewSource.  The internal version sets
//    /// the culture on the view from the xml:Lang of the host object.
//    /// </summary>
//    internal static CollectionView GetDefaultCollectionView(object source, DependencyObject d, Func<object, object> GetSourceItem=null) 
//    {
//        CollectionView view = GetDefaultCollectionView(source, true, GetSourceItem); 
//
//        // at first use of a view, set its culture from the xml:lang of the
//        // element that's using the view 
//        if (view != null && view.Culture == null)
//        {
//            XmlLanguage language = (d != null) ? (XmlLanguage)d.GetValue(FrameworkElement.LanguageProperty) : null;
//            if (language != null) 
//            {
//                try 
//                { 
//                    view.Culture = language.GetSpecificCulture();
//                } 
//                catch (InvalidOperationException)
//                {
//                }
//            } 
//        }
//
//        return view; 
//    }


    // return the original (un-proxied) view for the given view
//    static ICollectionView 
    CollectionViewSource.GetOriginalView = function(/*ICollectionView*/ view)
    { 
        for (   /*CollectionViewProxy*/var proxy = (view instanceof EnsureCollectionViewProxy() ? view : null);
                proxy != null; 
                proxy = (view instanceof EnsureCollectionViewProxy() ? view : null)) 
        {
            view = proxy.ProxiedView; 
        }

        return view;
    };

	CollectionViewSource.Type = new Type("CollectionViewSource", CollectionViewSource, 
			[DependencyObject.Type, ISupportInitialize.Type, IWeakEventListener.Type]);
	return CollectionViewSource;
});

