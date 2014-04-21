/**
 * GridViewRowPresenterBase
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
	
	 // the minimum width for dummy header when measure
//   internal const double 
   var c_PaddingHeaderMinWidth = 2.0; 
   
	var GridViewRowPresenterBase = declare("GridViewRowPresenterBase", FrameworkElement,{
		constructor:function(){
//		      private UIElementCollection 
		      this._uiElementCollection = null;
//		      private bool 
		      this._needUpdateVisualTree = true;
//		      private List<double> 
		      this._desiredWidthList = null;
		},
		
		/// <summary> 
        ///     Returns a string representation of this object. 
        /// </summary>
        /// <returns></returns> 
//        public override string 
        ToString:function()
        {
            return SR.Get(SRID.ToStringFormatString_GridViewRowPresenterBase,
                this.GetType(), 
                (this.Columns != null) ? this.Columns.Count : 0);
        }, 
 
        /// <summary> 
        /// Gets the Visual child at the specified index. 
        /// </summary>
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if (this._uiElementCollection == null)
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)); 
            }
            return this._uiElementCollection[index]; 
        }, 
        /// <summary>
        /// process the column collection chagned event
        /// </summary>
//        internal virtual void 
        OnColumnCollectionChanged:function(/*GridViewColumnCollectionChangedEventArgs*/ e) 
        {
            if (this.DesiredWidthList != null) 
            { 
                if (e.Action == NotifyCollectionChangedAction.Remove
                    || e.Action == NotifyCollectionChangedAction.Replace) 
                {
                    // NOTE: The steps to make DesiredWidthList.Count <= e.ActualIndex
                    //
                    //  1. init with 3 auto columns; 
                    //  2. add 1 column to the column collection with width 90.0;
                    //  3. remove the column we jsut added to the the collection; 
                    // 
                    //  Now we have DesiredWidthList.Count equals to 3 while the removed column
                    //  has  ActualIndex equals to 3. 
                    //
                    if (this.DesiredWidthList.Count > e.ActualIndex)
                    {
                    	this.DesiredWidthList.RemoveAt(e.ActualIndex); 
                    }
                } 
                else if (e.Action == NotifyCollectionChangedAction.Reset) 
                {
                	this.DesiredWidthList = null; 
                }
            }
        },
 
        /// <summary>
        /// process the column property chagned event 
        /// </summary> 
//        internal abstract void 
        OnColumnPropertyChanged:function(/*GridViewColumn*/ column, /*string*/ propertyName){
        	
        },
 
        /// <summary>
        /// ensure ShareStateList have at least columns.Count items
        /// </summary>
//        internal void 
        EnsureDesiredWidthList:function() 
        {
            /*GridViewColumnCollection*/var columns = this.Columns; 
 
            if (columns != null)
            { 
                var count = columns.Count;

                if (this.DesiredWidthList == null)
                { 
                	this.DesiredWidthList = new List/*<double>*/(count);
                } 
 
                var c = count - this.DesiredWidthList.Count;
                for (var i = 0; i < c; i++) 
                {
                	this.DesiredWidthList.Add(Double.NaN);
                }
            } 
        },

        //
        // NOTE:
        // 
        // If the collection is NOT in view mode, RowPresenter should be mentor of the Collection.
        // But if presenter + collection are used to restyle ListBoxItems and the ItemsPanel is 
        // VSP, there are 2 problems: 
        //
        //  1. each RowPresenter want to be the mentor, too many context change event 
        //  2. when doing scroll, VSP will dispose those LB items which are out of view. But they
        //      are still referenced by the Collecion (at the Owner property) - memory leak.
        //
        // Solution: 
        //  If RowPresenter is inside an ItemsControl (IC\LB\CB), use the ItemsControl as the
        //  mentor. Therefore, 
        //      - context change is minimized because ItemsControl for different items is the same; 
        //      - no memory leak because when viturlizing, only dispose items not the IC itself.
        // 
//        private FrameworkElement 
        GetStableAncester:function()
        {
            /*ItemsControl*/var ic = ItemsControl.ItemsControlFromItemContainer(this.TemplatedParent);
 
            return (ic != null) ? ic : /*(FrameworkElement)*/this;
        }, 
        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary> 
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ args)
        {
            return false;   // this method is no longer used (but must remain, for compat)
        },

        /// <summary> 
        /// Handler of GridViewColumnCollection.CollectionChanged event. 
        /// </summary>
//        private void 
        ColumnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ arg) 
        {
            /*GridViewColumnCollectionChangedEventArgs*/
        	var e = arg instanceof GridViewColumnCollectionChangedEventArgs? arg : null;

            if (e != null 
                && this.IsPresenterVisualReady)// if and only if rowpresenter's visual is ready, shall rowpresenter go ahead process the event.
            { 
                // Property of one column changed 
                if (e.Column != null)
                { 
                	this.OnColumnPropertyChanged(e.Column, e.PropertyName);
                }
                else
                { 
                	this.OnColumnCollectionChanged(e);
                } 
            } 
        }
	});
	
	Object.defineProperties(GridViewRowPresenterBase.prototype,{
 
        /// <summary>
        /// Columns Property 
        /// </summary> 
//        public GridViewColumnCollection 
        Columns:
        { 
            get:function() { return this.GetValue(GridViewRowPresenterBase.ColumnsProperty); },
            set:function(value) { this.SetValue(GridViewRowPresenterBase.ColumnsProperty, value); }
        },
 
        /// <summary> 
        /// Returns enumerator to logical children. 
        /// </summary>
//        protected internal override IEnumerator 
        LogicalChildren: 
        {
            get:function()
            {
                if (this.InternalChildren.Count == 0) 
                {
                    // empty GridViewRowPresenterBase has *no* logical children; give empty enumerator 
                    return EmptyEnumerator.Instance; 
                }
 
                // otherwise, its logical children is its visual children
                return this.InternalChildren.GetEnumerator();
            }
        }, 

        /// <summary> 
        /// Gets the Visual children count. 
        /// </summary>
//        protected override int 
        VisualChildrenCount: 
        {
            get:function()
            {
                if (this._uiElementCollection == null) 
                {
                    return 0; 
                } 
                else
                { 
                    return this._uiElementCollection.Count;
                }
            }
        },
        
 
        /// <summary> 
        /// list of currently reached max value of DesiredWidth of cell in the column
        /// </summary> 
//        internal List<double> 
        DesiredWidthList:
        {
            get:function() { return this._desiredWidthList; },
            set:function(value) { this._desiredWidthList = value; } 
        },
 
        /// <summary> 
        /// if visual tree is out of date
        /// </summary> 
//        internal bool 
        NeedUpdateVisualTree:
        {
            get:function() { return this._needUpdateVisualTree; },
            set:function(value) { this._needUpdateVisualTree = value; } 
        },
 
        /// <summary> 
        /// collection if children
        /// </summary> 
//        internal UIElementCollection 
        InternalChildren:
        {
            get:function()
            { 
                if (this._uiElementCollection == null) //nobody used it yet
                { 
                	this._uiElementCollection = new UIElementCollection(this /* visual parent */, this /* logical parent */); 
                }
 
                return this._uiElementCollection;
            }
        },
 
        // if and only if both conditions below are satisfied, row presenter visual is ready.
        // 1. is initialized, which ensures RowPresenter is created 
        // 2. !NeedUpdateVisualTree, which ensures all visual elements generated by RowPresenter are created
//        private bool 
        IsPresenterVisualReady:
        {
            get:function() { return (IsInitialized && !NeedUpdateVisualTree); } 
        }
 
	});
	
	Object.defineProperties(GridViewRowPresenterBase, {
 
        /// <summary> 
        ///  Columns DependencyProperty
        /// </summary>
//        public static readonly DependencyProperty 
        ColumnsProperty:
        {
        	get:function(){
        		if(GridViewRowPresenterBase._ColumnsProperty === undefined){
        			GridViewRowPresenterBase._ColumnsProperty =
        	            DependencyProperty.Register( 
        	                    "Columns",
        	                    GridViewColumnCollection.Type, 
        	                    GridViewRowPresenterBase.Type, 
        	                    new FrameworkPropertyMetadata(
        	                        null /* default value */, 
        	                        FrameworkPropertyMetadataOptions.AffectsMeasure,
        	                        new PropertyChangedCallback(ColumnsPropertyChanged)));
        		}
        		return ;
        	}
        }
 
	});


    // Property invalidation callback invoked when ColumnCollectionProperty is invalidated 
//    private static void 
    function ColumnsPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        /*GridViewRowPresenterBase*/var c = d;

        /*GridViewColumnCollection*/var oldCollection = e.OldValue;

        if (oldCollection != null) 
        {
            InternalCollectionChangedEventManager.RemoveHandler(oldCollection, c.ColumnCollectionChanged); 

            // NOTE:
            // If the collection is NOT in view mode (a.k.a owner isn't GridView),
            // RowPresenter is responsible to be or to find one to be the collection's mentor. 
            //
            if (!oldCollection.InViewMode && oldCollection.Owner == c.GetStableAncester()) 
            { 
                oldCollection.Owner = null;
            } 
        }

        /*GridViewColumnCollection*/var newCollection = e.NewValue;

        if (newCollection != null)
        { 
            InternalCollectionChangedEventManager.AddHandler(newCollection, c.ColumnCollectionChanged); 

            // Similar to what we do to oldCollection. But, of course, in a reverse way. 
            if (!newCollection.InViewMode && newCollection.Owner == null)
            {
                newCollection.Owner = c.GetStableAncester();
            } 
        }

        c.NeedUpdateVisualTree = true; 
        c.InvalidateMeasure();
    }
	
	GridViewRowPresenterBase.Type = new Type("GridViewRowPresenterBase", GridViewRowPresenterBase, [FrameworkElement.Type]);
	return GridViewRowPresenterBase;
});
 
//    /// <summary>
//    /// Manager for the GridViewColumnCollection.CollectionChanged event. 
//    /// </summary>
//    internal class InternalCollectionChangedEventManager : WeakEventManager
//    {
//        private InternalCollectionChangedEventManager()
//        {
//        }
//
//        /// <summary> 
//        /// Add a listener to the given source's event.
//        /// </summary> 
//        public static void AddListener(GridViewColumnCollection source, IWeakEventListener listener) 
//        {
//            if (source == null) 
//                throw new ArgumentNullException("source");
//            if (listener == null)
//                throw new ArgumentNullException("listener");
// 
//            CurrentManager.ProtectedAddListener(source, listener);
//        } 
// 
//        /// <summary>
//        /// Remove a listener to the given source's event. 
//        /// </summary>
//        public static void RemoveListener(GridViewColumnCollection source, IWeakEventListener listener)
//        {
//            if (source == null) 
//                throw new ArgumentNullException("source");
//            if (listener == null) 
//                throw new ArgumentNullException("listener"); 
//
//            CurrentManager.ProtectedRemoveListener(source, listener); 
//        }
//
//        /// <summary>
//        /// Add a handler for the given source's event. 
//        /// </summary>
//        public static void AddHandler(GridViewColumnCollection source, EventHandler<NotifyCollectionChangedEventArgs> handler) 
//        { 
//            if (handler == null)
//                throw new ArgumentNullException("handler"); 
//
//            CurrentManager.ProtectedAddHandler(source, handler);
//        }
// 
//        /// <summary>
//        /// Remove a handler for the given source's event. 
//        /// </summary> 
//        public static void RemoveHandler(GridViewColumnCollection source, EventHandler<NotifyCollectionChangedEventArgs> handler)
//        { 
//            if (handler == null)
//                throw new ArgumentNullException("handler");
//
//            CurrentManager.ProtectedRemoveHandler(source, handler); 
//        }
//
//        /// <summary> 
//        /// Return a new list to hold listeners to the event. 
//        /// </summary>
//        protected override ListenerList NewListenerList() 
//        {
//            return new ListenerList<NotifyCollectionChangedEventArgs>();
//        }
// 
//        /// <summary>
//        /// Listen to the given source for the event. 
//        /// </summary> 
//        protected override void StartListening(object source)
//        { 
//            GridViewColumnCollection typedSource = (GridViewColumnCollection)source;
//            typedSource.InternalCollectionChanged += new NotifyCollectionChangedEventHandler(OnCollectionChanged);
//        }
// 
//        /// <summary>
//        /// Stop listening to the given source for the event. 
//        /// </summary> 
//        protected override void StopListening(object source)
//        { 
//            GridViewColumnCollection typedSource = (GridViewColumnCollection)source;
//            typedSource.InternalCollectionChanged -= new NotifyCollectionChangedEventHandler(OnCollectionChanged);
//        }
//        //
//
//        // get the event manager for the current thread 
//        private static InternalCollectionChangedEventManager CurrentManager
//        { 
//            get 
//            {
//                Type managerType = typeof(InternalCollectionChangedEventManager); 
//                InternalCollectionChangedEventManager manager = (InternalCollectionChangedEventManager)GetCurrentManager(managerType);
//
//                // at first use, create and register a new manager
//                if (manager == null) 
//                {
//                    manager = new InternalCollectionChangedEventManager(); 
//                    SetCurrentManager(managerType, manager); 
//                }
// 
//                return manager;
//            }
//        }
//
//        // event handler for CollectionChanged event 
//        private void OnCollectionChanged(object sender, NotifyCollectionChangedEventArgs args)
//        { 
//            DeliverEvent(sender, args); 
//        }


