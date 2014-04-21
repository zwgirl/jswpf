/**
 * PropertyPathWorker
 */
define(["dojo/_base/declare", "system/Type",
        "windows/DependencyObject", "windows/DependencyProperty",
        "windows/IWeakEventListener", "system/IDisposable",
        /*"data/BindingExpression", */"data/BindingExpressionBase", "componentmodel/ICollectionView",
        "internal.data/DataBindEngine", "windows/PropertyPathStatus", "internal.data/SourceValueType",
        "componentmodel/INotifyPropertyChanged", "internal.data/DrillIn", 
        "componentmodel/PropertyChangedEventManager", "reflection/PropertyInfo",
        "reflection/PropertyDescriptor", "internal.data/DynamicObjectAccessor",
        "internal.data/AccessorInfo", "internal.data/DynamicPropertyAccessor"], 
		function(declare, Type,
				DependencyObject, DependencyProperty,
				IWeakEventListener, IDisposable, 
				/*BindingExpression, */BindingExpressionBase, ICollectionView,
				DataBindEngine, PropertyPathStatus, SourceValueType,
				INotifyPropertyChanged, DrillIn,
				PropertyChangedEventManager, PropertyInfo,
				PropertyDescriptor, DynamicObjectAccessor,
				AccessorInfo, DynamicPropertyAccessor ){
	//struct
	var SourceValueState = declare("SourceValueState", Object,{
		constructor:function(){
			this._item = null;
			this._collectionView = null;
			this.info = null;
			this._type = null;
			this._args = null;
		}
	}); 
	
	Object.defineProperties(SourceValueState.prototype,{
//        public ICollectionView 
        collectionView:
        {
        	get:function(){
        		return this._collectionView;
        	},
        	set:function(value){
        		this._collectionView = value;
        	}
        },
//        public object 
        item:
        {
        	get:function(){
        		return this._item;
        	},
        	set:function(value){
        		this._item = value;
        	}
        },
//        public object 
        info:
        {
        	get:function(){
        		return this._info;
        	},
        	set:function(value){
        		this._info = value;
        	}
        },             // PropertyInfo or PropertyDescriptor or DP 
//        public Type 
        type:
        {
        	get:function(){
        		return this._type;
        	},
        	set:function(value){
        		this._type = value;
        	}
        },              // Type of the value (useful for Arrays)
//        public object[] 
        args:
        {
        	get:function(){
        		return this._args;
        	},
        	set:function(value){
        		this._args = value;
        	}
        },           // for indexers 
	});
	
	SourceValueState.Type = new Type("SourceValueState", SourceValueState, [Object.Type]);
	
	 
    // wrapper for arguments to IList indexer
	var IListIndexerArg = declare("IListIndexerArg", null,{
		constructor:function(/*int*/ arg)
        {
            this._arg = arg; 
        }
	});
	
	Object.defineProperties(IListIndexerArg.prototype, {
//        public int 
        Value: { get:function() { return this._arg; } } 
	});


    // helper for setting context via the "using" pattern
    // wrapper for arguments to IList indexer
	var ContextHelper = declare("ContextHelper", IDisposable, {
		constructor:function(/*PropertyPathWorker*/ owner) 
        {
            this._owner = owner; 
        },
        
//        public void 
        SetContext:function(/*object*/ rootItem)
        { 
            this._owner.TreeContext = rootItem instanceof DependencyObject ? rootItem : null;
            this._owner.AttachToRootItem(rootItem); 
        },

//        void IDisposable.
        Dispose:function() 
        {
            this._owner.DetachFromRootItem();
            this._owner.TreeContext = null;
//            GC.SuppressFinalize(this); 
        }
	});
	
//  static readonly Char[] 
    var s_comma = ','; 
    
//    static readonly Char[] 
    var s_dot   = '.';

//    static readonly object 
    var NoParent = {"name" : "NoParent"}; //new NamedObject("NoParent");
//    static readonly object 
    var AsyncRequestPending = {"name" : "AsyncRequestPending"}; //new NamedObject("AsyncRequestPending"); 
//    internal static readonly object 
    var IListIndexOutOfRange = {"name" : "IListIndexOutOfRange"}; //new NamedObject("IListIndexOutOfRange");

	var PropertyPathWorker = declare("PropertyPathWorker", IWeakEventListener, {
		constructor:function( /*PropertyPath*/ path, /*ClrBindingWorker*/ host, /*bool*/ isDynamic, /*DataBindEngine*/ engine){
			if(isDynamic === undefined){
				isDynamic = false;
			}
			
			if(host === undefined){
				host = null;
			}
			
			this._isDynamic = isDynamic; 
			this._host = host; 
			
			if(arguments.length == 1){
				engine = DataBindEngine.CurrentDataBindEngine;
			}else if(arguments.length == 2){
				engine = host;
			}
			this._engine = engine; 

		    this._parent = path;
		    this._arySVS = []; //new SourceValueState[path.Length]; 
		    
		    // initialize each level to NullDataItem, so that the first real 
		    // item will force a change
		    for (var i=path.Length-1; i>=0; --i)
		    {
		    	this._arySVS[i] = new SourceValueState(); 
		        this._arySVS[i].item = Type.NullDataItem; //BindingExpression.NullDataItem; 
		    }
		    

//	        PropertyPathStatus  
		    this._status = 0;
//	        object              
		    this._treeContext = null; 
//	        object              
		    this._rootItem = null; 
//	        ContextHelper       
		    this._contextHelper = null; 
	 
//	        bool                _dependencySourcesChanged;
//	        bool                _needsDirectNotification; 
//	        bool?               _isDBNullValidForUpdate;
		},
		
//        internal void 
        SetTreeContext:function(/*WeakReference*/ wr)
        { 
            this._treeContext = wr; //BindingExpression.CreateReference(wr); 
        },
        
//        internal object 
        GetItem:function(/*int*/ level) 
        {
//        	return BindingExpression.GetReference(_arySVS[level].item); 
            return this._arySVS[level].item; 
        },

//        internal object 
        GetAccessor:function(/*int*/ level)
        { 
            return this._arySVS[level].info;
        },
 
//        internal object[] 
        GetIndexerArguments:function(/*int*/ level)
        { 
            /*object[]*/var args = this._arySVS[level].args;

            // unwrap the IList wrapper, if any
            /*IListIndexerArg*/var wrapper; 
            if (args != null && args.length == 1 &&
                (wrapper = args[0] instanceof IListIndexerArg ? args[0] : null) != null) 
            { 
                return [wrapper.Value]; //new object[] { wrapper.Value };
            } 

            return args;
        },
        
 
//        internal Type 
        GetType:function(/*int*/ level)
        { 
            return this._arySVS[level].type; 
        },
 
        //-------  target mode ------

        // Set the context for the path.  Use this method in "target" mode
        // to connect the path to a rootItem for a short time: 
        //      using (path.SetContext(myItem))
        //      { 
        //          ... call target-mode convenience methods ... 
        //      }
//        internal IDisposable 
        SetContext:function(/*object*/ rootItem) 
        {
            if (this._contextHelper == null)
            	this._contextHelper = new ContextHelper(this);
 
            this._contextHelper.SetContext(rootItem);
            return this._contextHelper; 
        },

        //-------  source mode (should only be called by ClrBindingWorker) ------ 

//        internal void 
        AttachToRootItem:function(/*object*/ rootItem)
        {
//            _rootItem = BindingExpression.CreateReference(rootItem); 
            this._rootItem = rootItem; 
            this.UpdateSourceValueState(-1, null);
        },
 
//        internal void 
        DetachFromRootItem:function()
        { 
            this._rootItem = Type.NullDataItem; 
            this.UpdateSourceValueState(-1, null);
            this._rootItem = null;
        },

//        internal object 
        GetValue:function(/*object*/ item, /*int*/ level) 
        { 
//            DependencyProperty dp; 
//            PropertyInfo pi;
//            PropertyDescriptor pd;
//            DynamicPropertyAccessor dpa;
//            object value = DependencyProperty.UnsetValue; 
//            SetPropertyInfo(_arySVS[level].info, out pi, out pd, out dp, out dpa);

            var value = DependencyProperty.UnsetValue; 
            
            var piOut = {
        		"pi":null,
            };
            var pdOut = {
        		"pd":null,
            };
            var dpOut = {
        		"dp":null,
            };
            var dpaOut = {
        		"dpa":null,
            };
            this.SetPropertyInfo(this._arySVS[level].info, /*out pi*/piOut, /*out pd*/pdOut, /*out dp*/dpOut, /*out dpa*/dpaOut);
 
            /*DependencyProperty*/var dp = dpOut.dp; 
            /*PropertyInfo*/var pi = piOut.pi;
            /*PropertyDescriptor*/var pd = pdOut.pd;
            /*DynamicPropertyAccessor*/var dpa = dpaOut.dpa;           
            
            switch (this.SVI[level].type) 
            {
            case SourceValueType.Property: 
                if (pi != null)
                {
                    value = pi.GetValue(item, null);
                } 
                else if (pd != null)
                { 
                    var indexerIsNext = (level+1 < this.SVI.length && this.SVI[level+1].type == SourceValueType.Indexer); 
                    value = this.Engine.GetValue(item, pd, indexerIsNext);
                } 
                else if (dp != null)
                {
                    /*DependencyObject*/var d = /*(DependencyObject)*/item;
                    if (level != this.Length-1 || this._host == null || this._host.TransfersDefaultValue) 
                        value = d.GetValue(dp);
                    else if (!Helper.HasDefaultValue(d, dp)) 
                        value = d.GetValue(dp); 
                    else
                        value = Type.IgnoreDefaultValue; 
                }
                else if (dpa != null)
                {
                    value = dpa.GetValue(item); 
                }
                break; 
 
            case SourceValueType.Indexer:
                /*DynamicIndexerAccessor*/var dia; 
                //
                if (pi != null)
                {
                    /*object[]*/var args = this._arySVS[level].args; 

                    /*IListIndexerArg*/var wrapper; 
                    if (args != null && args.Length == 1 && 
                        (wrapper = (args[0] instanceof IListIndexerArg ? args[0] : null)) != null)
                    { 
                        // common special case: IList indexer.  Avoid
                        // out-of-range exceptions.
                        var index = wrapper.Value;
                        /*IList*/var ilist = item; 

                        if (0 <= index && index < ilist.Count) 
                        { 
                            value = ilist.Get(index);
                        } 
                        else
                        {
                            value = this.IListIndexOutOfRange;
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
                else if ((dia = (this._arySVS[level].info instanceof DynamicIndexerAccessor ? this._arySVS[level].info : null))
                		!= null) 
                { 
                    value = dia.GetValue(item, this._arySVS[level].args);
                } 
                else
                {
                    throw new Error('NotSupportedException(SR.Get(SRID.IndexedPropDescNotImplemented)');
                } 
                break;
 
            case SourceValueType.Direct: 
                value = item;
                break; 
            }

            return value; 
        },
        
//      internal object 
//        GetValue:function(/*object*/ item, /*int*/ level) 
//        { 
//
//            var value = DependencyProperty.UnsetValue; 
//            
//            switch (this.SVI[level].type) 
//            {
//            case SourceValueType.Property: 
//            	value = item[this.SVI[level].propertyName]; //dpa.GetValue(item); 
//                break; 
// 
//            case SourceValueType.Indexer:
//            	value = item[this.SVI[level].propertyName]; ; 
//                break;
// 
//            case SourceValueType.Direct: 
//                value = item;
//                break; 
//            }
//
//            return value; 
//        },

//        internal void 
//        SetValue:function(/*object*/ item, /*object*/ value)
//        { 
//        	if(item == null){
//        		return null;
//        	}
//
//            var level = this._arySVS.length - 1;
//            switch (this.SVI[level].type) 
//            { 
//            case SourceValueType.Property:
//                item[this.SVI[level].propertyName] = value;
//                break; 
//
//            case SourceValueType.Indexer: 
//                item[this.SVI[level].propertyName] = value;
//                break; 
//            }
//        },
        
//        internal void 
        SetValue:function(/*object*/ item, /*object*/ value)
        { 
//            PropertyInfo pi; 
//            PropertyDescriptor pd; 
//            DependencyProperty dp;
//            DynamicPropertyAccessor dpa; 
//            int level = _arySVS.Length - 1;
//            SetPropertyInfo(_arySVS[level].info, out pi, out pd, out dp, out dpa);
            var level = this._arySVS.length - 1;
            var piOut = {
        		"pi":null,
            };
            var pdOut = {
        		"pd":null,
            };
            var dpOut = {
        		"dp":null,
            };
            var dpaOut = {
        		"dpa":null,
            };
            this.SetPropertyInfo(this._arySVS[level].info, /*out pi*/piOut, /*out pd*/pdOut, /*out dp*/dpOut, /*out dpa*/dpaOut); 
            /*DependencyProperty*/var dp = dpOut.dp; 
            /*PropertyInfo*/var pi = piOut.pi;
            /*PropertyDescriptor*/var pd = pdOut.pd;
            /*DynamicPropertyAccessor*/var dpa = dpaOut.dpa;  

            switch (this.SVI[level].type) 
            { 
            case SourceValueType.Property:
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
                    item.SetValue(dp, value);
                }
                else if (dpa != null)
                { 
                    dpa.SetValue(item, value);
                } 
                break; 

            case SourceValueType.Indexer: 
                /*DynamicIndexerAccessor*/var dia;
                if (pi != null)
                { 
                    pi.SetValue(item, value,
                                    BindingFlags.SetProperty, null, 
                                    this.GetIndexerArguments(level), 
                                    CultureInfo.InvariantCulture);
                } 
                else if ((dia = this._arySVS[level].info instanceof DynamicIndexerAccessor ? this._arySVS[level].info : null) != null)
                {
                    dia.SetValue(item, this._arySVS[level].args, value);
                } 
                else
                { 
                    throw new NotSupportedException(SR.Get(SRID.IndexedPropDescNotImplemented)); 
                }
                break; 
            }
        },

 
        // Called by BE.UpdateTarget().  Re-fetch the value at each level.
        // If there's a difference, simulate a property-change at that level. 
//        internal void 
        RefreshValue:function() 
        {
            for (var k=1; k<this._arySVS.length; ++k) 
            {
                var oldValue = this._arySVS[k].item;
                if (!Object.Equals(oldValue, this.RawValue(k-1)))
                { 
                    this.UpdateSourceValueState(k-1, null);
                    return; 
                } 
            }
 
            this.UpdateSourceValueState(this.Length-1, null);
        },

        // return the source level where the change happened, or -1 if the 
        // change is irrelevant.
//        internal int 
        LevelForPropertyChange:function(/*object*/ item, /*string*/ propertyName) 
        { 
            // This test must be thread-safe - it can get called on the "wrong" context.
            // It's read-only (good).  And if another thread changes the values it reads, 
            // the worst that can happen is to schedule a transfer operation needlessly -
            // the operation itself won't do anything (since the test is repeated on the
            // right thread).
 
            var isIndexer = propertyName == Binding.IndexerName;
 
            for (var k=0; k<this._arySVS.length; ++k) 
            {
//            	object o = BindingExpression.GetReference(_arySVS[k].item); 
                var o = this._arySVS[k].item; 
                if (o == Type.StaticSource)
                    o = null;

                if (o == item && 
                        (String.IsNullOrEmpty(propertyName) ||
                         (isIndexer && this.SVI[k].type ==SourceValueType.Indexer) || 
                         String.Equals(this.SVI[k].propertyName, propertyName/*, StringComparison.OrdinalIgnoreCase*/))) 
                {
                    return k; 
                }
            }

            return -1; 
        },
 
//        internal void 
        OnPropertyChangedAtLevel:function(/*int*/ level) 
        {
            this.UpdateSourceValueState(level, null); 
        },

//        internal void 
        OnCurrentChanged:function(/*ICollectionView*/ collectionView)
        { 
            for (var k=0; k<this.Length; ++k)
            { 
                if (this._arySVS[k].collectionView == collectionView) 
                {
                	this._host.CancelPendingTasks(); 

                    // update everything below that level
                	this.UpdateSourceValueState(k, collectionView);
                    break; 
                }
            } 
        },

        // determine if a source invalidation is relevant. 
        // This method must be thread-safe - it can be called on any Dispatcher.
//        internal bool 
        UsesDependencyProperty:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp)
        {
            if (dp == DependencyObject.DirectDependencyProperty) 
            {
                // the only way we get notified about this property is when we 
                // ask for it. 
                return true;
            } 

            // find the source level where the change happened
            for (var k=0; k<this._arySVS.length; ++k)
            { 
                if ((this._arySVS[k].info == dp) && (this._arySVS[k].item == d))
                { 
                    return true; 
                }
            } 

            return false;
        },
 
//        internal void 
        OnDependencyPropertyChanged:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*bool*/ isASubPropertyChange)
        { 
            if (dp == DependencyObject.DirectDependencyProperty) 
            {
                // the only way we get notified about this property is when the raw 
                // value reports a subProperty change.
            	this.UpdateSourceValueState(this._arySVS.length, null, Type.NullDataItem, isASubPropertyChange);
                return;
            } 

            // find the source level where the change happened 
            var k; 
            for (k=0; k<this._arySVS.length; ++k)
            { 
                if ((this._arySVS[k].info == dp) && (this._arySVS[k].item == d))
                {
                    // update everything below that level
                	this.UpdateSourceValueState(k, null, Type.NullDataItem, isASubPropertyChange); 
                    break;
                } 
            } 
        },
 
//        internal void 
        OnNewValue:function(/*int*/ level, /*object*/ value)
        {
            // optimistically assume the new value will fix previous path errors
            this._status = PropertyPathStatus.Active; 
            if (level < this.Length - 1)
            	this.UpdateSourceValueState(level, null, value, false); 
        },

        // for error reporting only 
//        internal SourceValueInfo 
        GetSourceValueInfo:function(/*int*/ level)
        {
            return this.SVI[level];
        },


//        // fill in the SourceValueState with updated infomation, starting at level k+1. 
//        // If view isn't null, also update the current item at level k. 
////        private void 
//        UpdateSourceValueState:function(/*int*/ k, /*ICollectionView*/ collectionView)
//        { 
//            UpdateSourceValueState(k, collectionView, BindingExpression.NullDataItem, false);
//        }

        // fill in the SourceValueState with updated infomation, starting at level k+1. 
        // If view isn't null, also update the current item at level k.
//        private void 
        UpdateSourceValueState:function(/*int*/ k, /*ICollectionView*/ collectionView, /*object*/ newValue, /*bool*/ isASubPropertyChange) 
        { 
        	if(newValue===undefined){
        		newValue = Type.NullDataItem;
        	}
        	
        	if(isASubPropertyChange === undefined){
        		isASubPropertyChange = false;
        	}
            // give host a chance to shut down the binding if the target has
            // gone away 
            /*DependencyObject*/var target = null;
            if (this._host != null)
            {
                target = this._host.CheckTarget(); 
                if (this._rootItem != Type.NullDataItem && target == null)
                    return; 
            } 

            var initialLevel = k; 
            var rawValue = null;

            // optimistically assume the new value will fix previous path errors
            this._status = PropertyPathStatus.Active; 

            // prepare to collect changes to dependency sources 
            this._dependencySourcesChanged = false; 

            // Update the current item at level k, if requested 
            if (collectionView != null)
            {
//                Debug.Assert(0<=k && k<_arySVS.Length && _arySVS[k].collectionView == collectionView, "bad parameters to UpdateSourceValueState");
            	this.ReplaceItem(k, collectionView.CurrentItem, NoParent); 
            }
 
            // update the remaining levels 
            for (++k; k<this._arySVS.length; ++k)
            { 
                isASubPropertyChange = false;   // sub-property changes only matter at the last level

                /*ICollectionView*/var oldCollectionView = this._arySVS[k].collectionView;
 
                // replace the item at level k using parent from level k-1
                rawValue = (newValue == Type.NullDataItem) ? this.RawValue(k-1) : newValue; 
                newValue = Type.NullDataItem; 
                if (rawValue == this.AsyncRequestPending)
                { 
                	this._status = PropertyPathStatus.AsyncRequestPending;
                    break;      // we'll resume the loop after the request completes
                }
 
                this.ReplaceItem(k, Type.NullDataItem, rawValue);
 
                // replace view, if necessary 
                /*ICollectionView*/var newCollectionView = this._arySVS[k].collectionView;
                if (oldCollectionView != newCollectionView && this._host != null) 
                {
                	this._host.ReplaceCurrentItem(oldCollectionView, newCollectionView);
                }
            } 

            // notify binding about what happened 
            if (this._host != null) 
            {
                if (initialLevel < this._arySVS.length) 
                {
                    // when something in the path changes, recompute whether we
                    // need direct notifications from the raw value
                	this.NeedsDirectNotification = this._status == PropertyPathStatus.Active && 
                	this._arySVS.length > 0 &&
                            this.SVI[this._arySVS.length-1].type != SourceValueType.Direct && 
                            !(this._arySVS[this._arySVS.length-1].info instanceof DependencyProperty) && 
                            /*typeof(DependencyObject)*/DependencyObject.Type.IsAssignableFrom(this._arySVS[this._arySVS.length-1].type);
                } 

                this._host.NewValueAvailable(this._dependencySourcesChanged, initialLevel < 0, isASubPropertyChange);
            }
 
//            GC.KeepAlive(target);   // keep target alive during changes (bug 956831)
        }, 
 
        // replace the item at level k with the given item, or with an item obtained from the given parent
//        private void 
        ReplaceItem:function(/*int*/ k, /*object*/ newO, /*object*/ parent) 
        {
            var svs = new SourceValueState();

            var oldO = this._arySVS[k].item; //BindingExpression.GetReference(_arySVS[k].item);

            // stop listening to old item 
            if (this.IsDynamic && this.SVI[k].type != SourceValueType.Direct)
            { 
                /*INotifyPropertyChanged*/var oldPC;
//                DependencyProperty oldDP;
//                PropertyInfo oldPI;
//                PropertyDescriptor oldPD; 
//                DynamicObjectAccessor oldDOA;
//                PropertyPath.DowncastAccessor(_arySVS[k].info, out oldDP, out oldPI, out oldPD, out oldDOA); 
                
                var dpOut = {
                	"dp":null
                };
                var pdOut = {
                	"pd":null,
                };
                
                var piOut = {
                	"pi":null,
                };
                
                var doaOut = {
                	"doa":null,
                };
                PropertyPath.DowncastAccessor(this._arySVS[k].info, /*out dp*/dpOut, /*out pi*/piOut, /*out pd*/pdOut, /*out doa*/doaOut);
                /*DependencyProperty*/var oldDP = dpOut.dp;
                /*PropertyInfo*/var oldPI = piOut.pi;
                /*PropertyDescriptor*/var oldPD = pdOut.pd; 
                /*DynamicObjectAccessor*/var oldDOA = doaOut.doa;                

                if (newO == BindingExpression.StaticSource)
                { 
                    var declaringType = (oldPI != null) ? oldPI.DeclaringType
                                        : (oldPD != null) ? oldPD.ComponentType
                                        : null;
                    if (declaringType != null) 
                    {
                        StaticPropertyChangedEventManager.RemoveHandler(declaringType, 
                        		new EventHandler(this, this.OnStaticPropertyChanged), this.SVI[k].propertyName); 
                    } 
                }
                else if (oldDP != null) 
                {
                    this._dependencySourcesChanged = true;
                }
                else if ((oldPC = oldO instanceof INotifyPropertyChanged ? oldO : null) != null) 
                {
//                    PropertyChangedEventManager.RemoveHandler(oldPC, new EventHandler(this, this.OnPropertyChanged), this.SVI[k].propertyName);
                	oldPC.PropertyChanged.Remove(new EventHandler(this, this.OnPropertyChanged));
                } 
                else if (oldPD != null && oldO != null)
                { 
                    ValueChangedEventManager.RemoveHandler(oldO, new EventHandler(this, this.OnValueChanged), oldPD);
                }
            }

            // extra work at the last level
            if (this._host != null && k == this.Length-1) 
            { 
                // handle INotifyDataErrorInfo
                if (this.IsDynamic && this._host.ValidatesOnNotifyDataErrors) 
                {
                    var indei = oldO instanceof INotifyDataErrorInfo ? oldO : null;
                    if (indei != null)
                    { 
                        ErrorsChangedEventManager.RemoveHandler(indei, new EventHandler(this, this.OnErrorsChanged));
                    } 
                } 
            }

            // clear the IsDBNullValid cache
            this._isDBNullValidForUpdate = null;

            if (newO == null || 
                parent == DependencyProperty.UnsetValue ||
                parent == BindingExpression.NullDataItem || 
                parent == BindingExpressionBase.DisconnectedItem) 
            {
            	this._arySVS[k].item = newO; //BindingExpression.ReplaceReference(_arySVS[k].item, newO); 

                if (parent == DependencyProperty.UnsetValue ||
                    parent == BindingExpression.NullDataItem ||
                    parent == BindingExpressionBase.DisconnectedItem) 
                {
                    this._arySVS[k].collectionView = null; 
                } 

                return; 
            }

            // obtain the new item and its access info
            if (newO != BindingExpression.NullDataItem) 
            {
                parent = newO;              // used by error reporting 
                this.GetInfo(k, newO, /*ref*/ svs); 
                svs.collectionView = this._arySVS[k].collectionView;
            } 
            else
            {
                // Note: if we want to support binding to HasValue and/or Value
                // properties of nullable types, we need a way to find out if 
                // the rawvalue is Nullable and pass that information here.

                /*DrillIn*/var drillIn = this.SVI[k].drillIn; 
                /*ICollectionView*/var view = null;

                // first look for info on the parent
                if (drillIn != DrillIn.Always)
                {
                	this.GetInfo(k, parent, /*ref*/ svs); 
                }

                // if that fails, look for information on the view itself 
                if (svs.info == null)
                { 
                    view = CollectionViewSource.GetDefaultCollectionView(parent, this.TreeContext,
                        /*(x) =>*/function(x)
                        {
//                            return BindingExpression.GetReference((k == 0) ? _rootItem : _arySVS[k-1].item); 
                            return (k == 0) ? this._rootItem : this._arySVS[k-1].item;
                        });

                    if (view != null && drillIn != DrillIn.Always) 
                    {
                        if (view != parent)             // don't duplicate work 
                            this.GetInfo(k, view, /*ref*/ svs);
                    }
                }

                // if that fails, drill in to the current item
                if (svs.info == null && drillIn != DrillIn.Never && view != null) 
                { 
                    newO = view.CurrentItem;
                    if (newO != null) 
                    {
                        this.GetInfo(k, newO, /*ref*/ svs);
                        svs.collectionView = view;
                    } 
                    else
                    { 
                        // no current item: use previous info (if known) 
                        svs = this._arySVS[k];
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
                svs.item = BindingExpression.NullDataItem; //BindingExpression.ReplaceReference(svs.item, BindingExpression.NullDataItem);
                this._arySVS[k] = svs;
                this._status = PropertyPathStatus.PathError; 
                this.ReportNoInfoError(k, parent);
                return; 
            } 

            this._arySVS[k] = svs; 
            newO = svs.item; //BindingExpression.GetReference(svs.item);

            // start listening to new item 
            if (this.IsDynamic && this.SVI[k].type != SourceValueType.Direct)
            { 
                this.Engine.RegisterForCacheChanges(newO, svs.info); 

                /*INotifyPropertyChanged*/var newPC; 
//                DependencyProperty newDP;
//                PropertyInfo newPI;
//                PropertyDescriptor newPD;
//                DynamicObjectAccessor newDOA; 
//                PropertyPath.DowncastAccessor(svs.info, out newDP, out newPI, out newPD, out newDOA);
                
                var dpOut = {
                	"dp":null
                };
                var pdOut = {
                	"pd":null,
                };
                
                var piOut = {
                	"pi":null,
                };
                
                var doaOut = {
                	"doa":null,
                };
                PropertyPath.DowncastAccessor(svs.info, /*out dp*/dpOut, /*out pi*/piOut, /*out pd*/pdOut, /*out doa*/doaOut);
                /*DependencyProperty*/var newDP = dpOut.dp;
                /*PropertyInfo*/var newPI = piOut.pi;
                /*PropertyDescriptor*/var newPD = pdOut.pd; 
                /*DynamicObjectAccessor*/var newDOA = doaOut.doa;


                if (newO == BindingExpression.StaticSource) 
                {
                    var declaringType = (newPI != null) ? newPI.DeclaringType 
                                        : (newPD != null) ? newPD.ComponentType
                                        : null;
                    if (declaringType != null)
                    { 
                        StaticPropertyChangedEventManager.AddHandler(declaringType, 
                        		new EventHandler(this, this.OnStaticPropertyChanged), this.SVI[k].propertyName);
                    } 
                } 
                else if (newDP != null)
                { 
                	this._dependencySourcesChanged = true;
                }
                else if ((newPC = newO instanceof INotifyPropertyChanged ? newO : null) != null)
                { 
//                    PropertyChangedEventManager.AddHandler(newPC, new EventHandler(this, this.OnPropertyChanged), this.SVI[k].propertyName);
                	newPC.PropertyChanged.Combine(new EventHandler(this, this.OnPropertyChanged));
                } 
                else if (newPD != null && newO != null) 
                {
                    ValueChangedEventManager.AddHandler(newO, new EventHandler(this, this.OnValueChanged), newPD); 
                }
            }

            // extra work at the last level 
            if (this._host != null && k == this.Length-1)
            { 
                // set up the default transformer 
            	this._host.SetupDefaultValueConverter(svs.type);

                // check for request to update a read-only property
                if (this._host.IsReflective)
                {
                	this.CheckReadOnly(newO, svs.info); 
                }

                // handle INotifyDataErrorInfo 
                if (this._host.ValidatesOnNotifyDataErrors)
                { 
                    var indei= newO instanceof INotifyDataErrorInfo ? newO : null;
                    if (indei != null)
                    {
                        if (this.IsDynamic) 
                        {
                        	this.ErrorsChangedEventManager.AddHandler(indei, new EventHandler(this, this.OnErrorsChanged)); 
                        } 

                        this._host.OnDataErrorsChanged(indei, SourcePropertyName); 
                    }
                }
            }
        },

//        void 
        ReportNoInfoError:function(/*int*/ k, /*object*/ parent) 
        { 
            // report cannot find info.  Ignore when in priority bindings.
//            if (TraceData.IsEnabled) 
//            {
//                BindingExpression bindingExpression = (_host != null) ? _host.ParentBindingExpression : null;
//                if (bindingExpression == null || !bindingExpression.IsInPriorityBindingExpression)
//                { 
//                    if (!SystemXmlHelper.IsEmptyXmlDataCollection(parent))
//                    { 
//                        SourceValueInfo svi = SVI[k]; 
//                        string cs = (svi.type != SourceValueType.Indexer) ? svi.name : "[" + svi.name + "]";
//                        string ps = TraceData.DescribeSourceObject(parent); 
//                        string os = (svi.drillIn == DrillIn.Always) ? "current item of collection" : "object";
//
//                        // if the parent is null, the path error probably only means the
//                        // data provider hasn't produced any data yet.  When it does, 
//                        // the binding will try again and probably succeed.  Give milder
//                        // feedback for this special case, so as not to alarm users unduly. 
//                        if (parent == null) 
//                        {
//                            TraceData.Trace(TraceEventType.Information, TraceData.NullItem(cs, os), bindingExpression); 
//                        }
//                        // Similarly, if the parent is the NewItemPlaceholder.
//                        else if (parent == CollectionView.NewItemPlaceholder ||
//                                parent == DataGrid.NewItemPlaceholder) 
//                        {
//                            TraceData.Trace(TraceEventType.Information, TraceData.PlaceholderItem(cs, os), bindingExpression); 
//                        } 
//                        else
//                        { 
//                            TraceEventType traceType = (bindingExpression != null) ? bindingExpression.TraceLevel : TraceEventType.Error;
//                            TraceData.Trace(traceType, TraceData.ClrReplaceItem(cs, ps, os), bindingExpression);
//                        }
//                    } 
//                    else
//                    { 
//                        TraceEventType traceType = (bindingExpression != null) ? bindingExpression.TraceLevel : TraceEventType.Error; 
//                        _host.ReportBadXPath(traceType);
//                    } 
//
//                }
//            }
        },

        // determine if the cached state of the path is still correct.  This is 
        // used to deduce whether event leapfrogging has occurred along the path 
        // (i.e. something changed, but we haven't yet received the notification)
//        internal bool 
        IsPathCurrent:function(/*object*/ rootItem) 
        {
            if (this.Status != PropertyPathStatus.Active)
                return false;
 
            /*object*/ item = rootItem;
            for (var level=0, n=this.Length; level<n; ++level) 
            { 
                /*ICollectionView*/var view = this._arySVS[level].collectionView;
                if (view != null) 
                {
                    item = view.CurrentItem;
                }
 
                if (!Object.Equals(item, this._arySVS[level].item)
                    && !this.IsNonIdempotentProperty(level-1)) 
                { 
                    return false;
                } 

                if (level < n-1)
                {
                    item = this.GetValue(item, level); 
                }
            } 
 
            return true;
        },

        // Certain properties are known to be non-idempotent, i.e. they return a
        // different value every time the getter is called.   For the purpose of
        // detecting event leapfrogging, the value produced by such a property 
        // should be ignored.
//        bool 
        IsNonIdempotentProperty:function(/*int*/ level) 
        { 
            /*PropertyDescriptor*/var pd;
            if (level < 0 || (pd = (this._arySVS[level].info instanceof PropertyDescriptor ? this._arySVS[level].info : null)) == null) 
                return false;

            return SystemXmlLinqHelper.IsXLinqNonIdempotentProperty(pd);
        },

        // look for property/indexer on the given item 
//        private void 
        GetInfo:function(/*int*/ k, /*object*/ item, /*ref SourceValueState svs*/svs) 
        {
//            var oldItem = BindingExpression.GetReference(this._arySVS[k].item);
        	var oldItem = this._arySVS[k].item;

            // optimization - only change info if the type changed 
            // exception - if the info is a PropertyDescriptor, it might depend 
            // on the item itself (not just the type), so we have to re-fetch
//            var oldType = ReflectionHelper.GetReflectionType(oldItem); 
//            var newType = ReflectionHelper.GetReflectionType(item);
        	
            var oldType = oldItem.GetType(); 
            var newType = item.GetType();
            var sourceType = null;

            if (newType == oldType && oldItem != BindingExpression.NullDataItem && 
                !(this._arySVS[k].info instanceof PropertyDescriptor))
            { 
                svs = this._arySVS[k]; 
                svs.item = BindingExpression.ReplaceReference(svs.item, item);
                return; 
            }

            // if the new item is null, we won't find a property/indexer on it
            if (newType == null && SVI[k].type != SourceValueType.Direct) 
            {
                svs.info = null; 
                svs.args = null; 
                svs.type = null;
                svs.item = BindingExpression.ReplaceReference(svs.item, item); 
                return; 
            }

            // optimization - see if we've cached the answer
            var index; 
            var indexOut = {
            	"index" : index
            };
            
            
            /*bool*/var cacheAccessor = !PropertyPath.IsParameterIndex(this.SVI[k].name, /*out index*/indexOut);
            index = indexOut.index;
            if (cacheAccessor) 
            { 
                /*AccessorInfo*/var accessorInfo = this.Engine.AccessorTable.Get(this.SVI[k].type, newType, this.SVI[k].name);
                if (accessorInfo != null) 
                {
                    svs.info = accessorInfo.Accessor;
                    svs.type = accessorInfo.PropertyType;
                    svs.args = accessorInfo.Args; 

                    if (PropertyPath.IsStaticProperty(svs.info)) 
                        item = BindingExpression.StaticSource; 

//                    svs.item = BindingExpression.ReplaceReference(svs.item, item);   cym 
                    svs.item = item;
                    

                    if (this.IsDynamic && this.SVI[k].type == SourceValueType.Property && svs.info instanceof DependencyProperty)
                    {
                    	this._dependencySourcesChanged = true; 
                    }
                    return;
                }
            } 
 
            /*object*/var info = null;
            /*object[]*/var args = null; 

            switch (this.SVI[k].type)
            {
            case SourceValueType.Property: 
                info = this._parent.ResolvePropertyName(k, item, newType, this.TreeContext);

//                DependencyProperty dp; 
//                PropertyInfo pi1;
//                PropertyDescriptor pd;
//                DynamicObjectAccessor doa;
//                PropertyPath.DowncastAccessor(info, out dp, out pi1, out pd, out doa); 
                
                var dpOut = {
                	"dp":null
                };
                var pdOut = {
                	"pd":null,
                };
                
                var piOut = {
                	"pi":null,
                };
                
                var doaOut = {
                	"doa":null,
                };
                PropertyPath.DowncastAccessor(info, /*out dp*/dpOut, /*out pi*/piOut, /*out pd*/pdOut, /*out doa*/doaOut);
                /*DependencyProperty*/var dp = dpOut.dp;
                /*PropertyInfo*/var pi1 = piOut.pi;
                /*PropertyDescriptor*/var pd = pdOut.pd; 
                /*DynamicObjectAccessor*/var doa = doaOut.doa;
                    

                if (dp != null) 
                { 
                    sourceType = dp.PropertyType;
                    if (this.IsDynamic) 
                    {
                    	this._dependencySourcesChanged = true; 
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
                } 
                break; 

            case SourceValueType.Indexer: 
                /*IndexerParameterInfo[]*/
            	var aryInfo = this._parent.ResolveIndexerParams(k, this.TreeContext);

                // Check if we should treat the indexer as a property instead.
                // (See ShouldConvertIndexerToProperty for why we might do that.) 
                if (aryInfo.Length == 1 &&
                    (aryInfo[0].type == null || aryInfo[0].type == typeof(string))) 
                { 
                    /*string*/var name = /*(string)*/aryInfo[0].value;
                    var refName = {"name" : name};
                    var sCanConv = this.ShouldConvertIndexerToProperty(item, refName/*ref name*/)
                    name = refName.name;
                    if (sCanConv) 
                    {
                    	this._parent.ReplaceIndexerByProperty(k, name);
//                        goto case SourceValueType.Property;   // cym comment
                    } 
                }
 
                args = [] ;//new object[aryInfo.Length]; 

                // find the matching indexer 
                /*MemberInfo[][]*/var aryMembers= [] ;//new MemberInfo[][]{ GetIndexers(newType, k), null };
                /*bool*/var isIList = (item instanceof IList);
                if (isIList)
                    aryMembers[1] = typeof(IList).GetDefaultMembers(); 

                for (/*int*/var ii=0; info==null && ii<aryMembers.Length; ++ii) 
                { 
                    if (aryMembers[ii] == null)
                        continue; 

                    /*MemberInfo[]*/var defaultMembers = aryMembers[ii];

                    for (/*int*/var jj=0; jj<defaultMembers.Length; ++jj) 
                    {
                        /*PropertyInfo*/var pi = defaultMembers[jj] instanceof PropertyInfo ? defaultMembers[jj] : null; 
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
                        info = SystemCoreHelper.GetIndexerAccessor(args.Length); 
                        sourceType = typeof(Object);
                    } 
                }
 
                break;
 
            case SourceValueType.Direct: 
                if (!(item instanceof ICollectionView) || this._host == null || this._host.IsValidValue(item))
                { 
                    info = DependencyProperty.UnsetValue;
                    sourceType = newType;

                    if (this.Length == 1 && 
                            item instanceof Freezable &&    // subproperty notifications only arise from Freezables
                            item != this.TreeContext)    // avoid self-loops 
                    { 
                        info = DependencyObject.DirectDependencyProperty;
                        this._dependencySourcesChanged = true; 
                    }
                }
                break;
            } 
            if (PropertyPath.IsStaticProperty(info))
                item = BindingExpression.StaticSource; 
 
            svs.info = info;
            svs.args = args; 
            svs.type = sourceType;
//            svs.item = BindingExpression.ReplaceReference(svs.item, item);   //cym modify
            svs.item = item;

            // cache the answer, to avoid doing all that reflection again 
            // (but not if the answer is a PropertyDescriptor,
            // since then the answer potentially depends on the item itself) 
            if (cacheAccessor && info != null && !(info instanceof PropertyDescriptor)) 
            {
                this.Engine.AccessorTable.Set(this.SVI[k].type, newType, this.SVI[k].name, 
                            new AccessorInfo(info, sourceType, args));
            }
        },
        
 
        // get indexers declared by the given type, for the path component at level k
//        private MemberInfo[] 
        GetIndexers:function(/*Type*/ type, /*int*/ k) 
        { 
            if (k > 0 && this._arySVS[k-1].info == /*(object)*/IndexerPropertyInfo.Instance)
            { 
                // if the previous path component discovered a named indexed property,
                // return all the matches for the name
                /*List<MemberInfo>*/var list = new List/*<MemberInfo>*/();
                var name = this.SVI[k-1].name; 
                /*PropertyInfo[]*/var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);
 
                // we enumerate through all properties, rather than call GetProperty(name), 
                // to avoid AmbiguousMatchExceptions when there are multiple overloads
                for/*each*/(var i=0;i<properties.Count; i++) // (PropertyInfo pi in properties) 
                {
                	var pi = properties.Get(i);
                    if (pi.Name == name && this.IsIndexedProperty(pi))
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
        },
 
        // convert the (string) argument names to types appropriate for use with
        // the given property.  Put the results in the args[] array.  Return 
        // true if everything works.
//        private bool 
        MatchIndexerParameters:function(/*ParameterInfo[]*/ aryPI, /*IndexerParameterInfo[]*/ aryInfo, /*object[]*/ args, /*bool*/ isIList)
        {
            // must have the right number of parameters 
            if (aryPI != null && aryPI.Length != aryInfo.Length)
                return false; 
 
            // each parameter must be settable from user-specified type or from a string
            for (var i=0; i<args.Length; ++i) 
            {
                /*IndexerParameterInfo*/var pInfo = aryInfo[i];
                var paramType = (aryPI != null) ? aryPI[i].ParameterType : Object.Type;
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

                try 
                { 
                    var arg = null;
 
                    if (paramType == Number.Type)
                    {
                        // common case is paramType = Int32.  Use TryParse - this
                        // avoids expensive exceptions if it fails 
//                        var argInt;
//                        if (Int32.TryParse(pInfo.value, 
//                                    NumberStyles.Integer, 
//                                    TypeConverterHelper.InvariantEnglishUS.NumberFormat,
//                                    out argInt)) 
//                        {
//                            arg = argInt;
//                        }
                    	arg = pInfo.value;
                    } 
                    else
                    { 
                        var tc = TypeDescriptor.GetConverter(paramType); 
                        if (tc != null && tc.CanConvertFrom(typeof(string)))
                        { 
                            arg = tc.ConvertFromString(null, TypeConverterHelper.InvariantEnglishUS,
                                                            pInfo.value);
                            // technically the converter can return null as a legitimate
                            // value.  In practice, this seems always to be a sign that 
                            // the conversion didn't work (often because the converter
                            // reverts to the default behavior - returning null).  So 
                            // we treat null as an "error", and keep trying for something 
                            // better.  (See bug 861966)
                        } 
                    }

                    if (arg == null && paramType.IsAssignableFrom(typeof(string)))
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
                catch (/*Exception*/ ex) 
                {
                    if (CriticalExceptions.IsCriticalApplicationException(ex)) 
                        throw ex;
                    return false;
                }
            }

            // common case is IList - one arg of type Int32.  Wrap the arg so 
            // that we can treat it specially in Get/SetValue.
            if (isIList && aryPI.Length == 1 && aryPI[0].ParameterType == Number.Type) 
            { 
                args[0] = new IListIndexerArg(/*(int)*/args[0]);
            } 

            return true;
        },
 
//        private bool 
        ShouldConvertIndexerToProperty:function(/*object*/ item, /*ref string name*/nameRef)
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
                /*PropertyDescriptorCollection*/var properties = TypeDescriptor.GetProperties(item); 
                if (properties[name] != null)
                    return true; 

//                var index;
//                if (Int32.TryParse(name,
//                                    NumberStyles.Integer, 
//                                    TypeConverterHelper.InvariantEnglishUS.NumberFormat,
//                                    out index)) 
//                { 
//                    if (0 <= index && index < properties.Count)
//                    { 
//                        name = properties[index].Name;
//                        return true;
//                    }
//                } 
            }
 
            return false; 
        },
        
////      internal object 
//        RawValue:function() 
//        {
//            var rawValue = this.RawValue(Length-1); 
// 
//            if (rawValue == this.AsyncRequestPending)
//                rawValue = DependencyProperty.UnsetValue;     // the real value will arrive later 
//
//            return rawValue;
//        },
 
        // return the raw value from level k
//        private object 
        RawValue:function(/*int*/ k)
        {
        	if(arguments.length == 0){
        		var rawValue = this.RawValue(this.Length-1); 
        		 
        		if (rawValue == this.AsyncRequestPending)
        			rawValue = DependencyProperty.UnsetValue;     // the real value will arrive later 

        		return rawValue;
        	}
        	
            if (k < 0) 
                return this._rootItem;
            if (k >= this._arySVS.length) 
                return DependencyProperty.UnsetValue; 

            var item = this._arySVS[k].item; 
            var info = this._arySVS[k].info;

            // try to get the value, unless (a) binding is being detached,
            // (b) no info - e.g. Nullable with no value, or (c) item expected 
            // but not present - e.g. currency moved off the end.
            if (item != Type.NullDataItem && info != null && !(item == null && info != DependencyProperty.UnsetValue)) 
            { 
                var o = DependencyProperty.UnsetValue;
                /*DependencyProperty*/var dp = info instanceof DependencyProperty ? info :null; 

                // if the binding is async, post a request to get the value
                if (!(dp != null || this.SVI[k].type == SourceValueType.Direct))
                { 
                    if (this._host != null && this._host.AsyncGet(item, k))
                    { 
                    	this._status = PropertyPathStatus.AsyncRequestPending; 
                        return AsyncRequestPending;
                    } 
                }

                o = this.GetValue(item, k); 

                // catch the pseudo-exception as well 
                if (o == IListIndexOutOfRange)
                { 
                    o = DependencyProperty.UnsetValue; 
                    if (this._host != null)
                    	this._host.ReportGetValueError(k, item, new ArgumentOutOfRangeException("index")); 
                }

                return o; 
            } 

            if (this._host != null) 
            {
            	this._host.ReportRawValueErrors(k, item, info);
            }
 
            return DependencyProperty.UnsetValue;
        },
 
//        void 
        SetPropertyInfo:function(/*object*/ info, 
        		/*out PropertyInfo pi*/piOut, /*out PropertyDescriptor pd*/pdOut, 
        		/*out DependencyProperty dp*/dpOut, /*out DynamicPropertyAccessor dpa*/dpaOut)
        { 
        	piOut.pi = null;
        	pdOut.pd = null;
        	dpaOut.dpa = null;
        	dpOut.dp = info instanceof DependencyProperty ? info : null; 

            if (pdOut.dp == null) 
            { 
            	piOut.pi = info instanceof PropertyInfo ? info : null;
                if (piOut.pi == null) 
                {
                	pdOut.pd = info instanceof PropertyDescriptor ? info : null;

                    if (pdOut.pd == null) 
                    	dpaOut.dpa = info instanceof DynamicPropertyAccessor ? info : null;
                } 
            } 
        },
 
//        void 
        CheckReadOnly:function(/*object*/ item, /*object*/ info)
        {
//            /*PropertyInfo*/ var pi;
//            /*PropertyDescriptor*/var  pd; 
//            /*DependencyProperty*/var  dp;
//            /*DynamicPropertyAccessor*/var  dpa; 
//            SetPropertyInfo(info, out pi, out pd, out dp, out dpa); 
            
            var piOut = {
        		"pi":null,
            };
            var pdOut = {
        		"pd":null,
            };
            var dpOut = {
        		"dp":null,
            };
            var dpaOut = {
        		"dpa":null,
            };
            this.SetPropertyInfo(info, /*out pi*/piOut, /*out pd*/pdOut, /*out dp*/dpOut, /*out dpa*/dpaOut);
 
            /*DependencyProperty*/var dp = dpOut.dp; 
            /*PropertyInfo*/var pi = piOut.pi;
            /*PropertyDescriptor*/var pd = pdOut.pd;
            /*DynamicPropertyAccessor*/var dpa = dpaOut.dpa;

            if (pi != null) 
            {
                if (!pi.CanWrite)
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), pi.Name)');
            } 
            else if (pd != null)
            { 
                if (pd.IsReadOnly) 
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), pd.Name)');
            } 
            else if (dp != null)
            {
                if (dp.ReadOnly)
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), dp.Name)'); 
            }
            else if (dpa != null) 
            { 
                if (dpa.IsReadOnly)
                    throw new Error('InvalidOperationException(SR.Get(SRID.CannotWriteToReadOnly, item.GetType(), dpa.PropertyName)'); 
            }
        },

        // see whether DBNull is a valid value for update, and cache the answer 
//        void 
        DetermineWhetherDBNullIsValid:function()
        { 
            var result = false; 
            var item = this.GetItem(this.Length - 1);
 
            if (item != null && AssemblyHelper.IsLoaded(UncommonAssembly.System_Data))
            {
                result = DetermineWhetherDBNullIsValid(item);
            } 

            this._isDBNullValidForUpdate = result; 
        },

//        bool 
        DetermineWhetherDBNullIsValid:function(/*object*/ item) 
        {
//            /*PropertyInfo*/var pi;
//            /*PropertyDescriptor*/var pd;
//            /*DependencyProperty*/var dp; 
//            /*DynamicPropertyAccessor*/var dpa;
//            this.SetPropertyInfo(_arySVS[Length-1].info, out pi, out pd, out dp, out dpa); 
            
            var piOut = {
        		"pi":null,
            };
            var pdOut = {
        		"pd":null,
            };
            var dpOut = {
        		"dp":null,
            };
            var dpaOut = {
        		"dpa":null,
            };
            this.SetPropertyInfo(this._arySVS[Length-1].info, /*out pi*/piOut, /*out pd*/pdOut, /*out dp*/dpOut, /*out dpa*/dpaOut);
 
            /*DependencyProperty*/var dp = dpOut.dp; 
            /*PropertyInfo*/var pi = piOut.pi;
            /*PropertyDescriptor*/var pd = pdOut.pd;
            /*DynamicPropertyAccessor*/var dpa = dpaOut.dpa;
 
            /*string*/var columnName = (pd != null) ? pd.Name :
                                (pi != null) ? pi.Name : null; 

            var arg = (columnName == "Item" && pi != null) ? this._arySVS[this.Length-1].args[0] : null;

            return SystemDataHelper.DetermineWhetherDBNullIsValid(item, columnName, arg); 
        },
 
        /// <summary> 
        /// Handle events from the centralized event table
        /// </summary> 
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        {
            return false;   // this method is no longer used (but must remain, for compat)
        },

//        void 
        OnPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
        { 
//            if (IsExtendedTraceEnabled(TraceDataLevel.Events))
//            { 
//                TraceData.Trace(TraceEventType.Warning,
//                                    TraceData.GotEvent(
//                                        TraceData.Identify(_host.ParentBindingExpression),
//                                        "PropertyChanged", 
//                                        TraceData.Identify(sender)));
//            } 
 
            this._host.OnSourcePropertyChanged(sender, e.PropertyName);
        }, 

//        void 
        OnValueChanged:function(/*object*/ sender, /*ValueChangedEventArgs*/ e)
        {
            this._host.OnSourcePropertyChanged(sender, e.PropertyDescriptor.Name); 
        },
 
//        void 
        OnErrorsChanged:function(/*object*/ sender, /*DataErrorsChangedEventArgs*/ e) 
        {
            if (e.PropertyName == this.SourcePropertyName) 
            {
                this._host.OnDataErrorsChanged(/*(INotifyDataErrorInfo)*/sender, e.PropertyName);
            }
        },

//        void 
        OnStaticPropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
        { 
            this._host.OnSourcePropertyChanged(sender, e.PropertyName);
        }
 
	});
	
	Object.defineProperties(PropertyPathWorker.prototype,{
 
//        internal int 
        Length: { get:function() { return this._parent.Length; } },
//        internal PropertyPathStatus 
        Status: { get:function() { return this._status; } }, 
 
//        internal DependencyObject 
        TreeContext:
        { 
            get:function() 
            { 
            	var result = this._treeContext;
            	return  result instanceof DependencyObject ? result : null; 
            },
            set:function(value) { this._treeContext = value; }
        },
        
//        internal bool 
        IsDBNullValidForUpdate:
        {
            get:function()
            { 
                if (!this._isDBNullValidForUpdate.HasValue)
                { 
                	this.DetermineWhetherDBNullIsValid(); 
                }
 
                return this._isDBNullValidForUpdate.Value;
            }
        },
 
//        internal object 
        SourceItem:
        { 
            get:function() 
            {
                var level = this.Length-1; 
                var item = (level >= 0) ? this.GetItem(level) : null;
                if (item == Type.NullDataItem)
                {
                    item = null; 
                }
 
                return item; 
            }
        },

//        internal string 
        SourcePropertyName:
        {
            get:function() 
            {
                var level = this.Length-1; 
 
                if (level < 0)
                    return null; 

                switch (this.SVI[level].type)
                {
                    case SourceValueType.Property: 
//                        // return the real name of the property
//                        DependencyProperty dp; 
//                        PropertyInfo pi; 
//                        PropertyDescriptor pd;
//                        DynamicPropertyAccessor dpa; 
//
//                        SetPropertyInfo(GetAccessor(level), out pi, out pd, out dp, out dpa);
                        
                        var piOut = {
                    		"pi":null,
                        };
                        var pdOut = {
                    		"pd":null,
                        };
                        var dpOut = {
                    		"dp":null,
                        };
                        var dpaOut = {
                    		"dpa":null,
                        };
                        this.SetPropertyInfo(this.GetAccessor(level), /*out pi*/piOut, /*out pd*/pdOut, /*out dp*/dpOut, /*out dpa*/dpaOut);
             
                        /*DependencyProperty*/var dp = dpOut.dp; 
                        /*PropertyInfo*/var pi = piOut.pi;
                        /*PropertyDescriptor*/var pd = pdOut.pd;
                        /*DynamicPropertyAccessor*/var dpa = dpaOut.dpa;
                            
                        return  (dp != null) ? dp.Name :
                                (pi != null) ? pi.Name : 
                                (pd != null) ? pd.Name :
                                (dpa != null) ? dpa.PropertyName : null; 
 
                    case SourceValueType.Indexer:
                        // return the indexer string, e.g. "[foo]" 
                        var s = this._parent.Path;
                        var lastBracketIndex = s.LastIndexOf('[');
                        return s.substring(lastBracketIndex);
                } 

                // in all other cases, no name is available 
                return null; 
            }
        }, 

        // true when we need to register for direct notification from the RawValue,
        // i.e. when it's a DO that we get to via a non-DP
//        internal bool 
        NeedsDirectNotification:
        {
            get:function() { return this._needsDirectNotification; }, 
            /*private*/ set:function(value)
            {
                if (value) 
                {
                    this._dependencySourcesChanged = true;
                }
                this._needsDirectNotification = value; 
            }
        },
 
//        bool 
        IsDynamic: { get:function() { return this._isDynamic; } },
//        SourceValueInfo[] 
        SVI: { get:function() { return this._parent.SVI; } }, 
//        DataBindEngine 
        Engine: { get:function() { return this._engine; } } 

 
	});
	
//  internal static bool 
	PropertyPathWorker.IsIndexedProperty = function(/*PropertyInfo*/ pi) 
    { 
        var result = false;
//        try
//        { 
//            result = (pi != null) && pi.GetIndexParameters().Length > 0;
//        }
//        catch (/*Exception*/ ex)
//        { 
//            // if the PropertyInfo throws an exception, treat it as non-indexed
//            if (CriticalExceptions.IsCriticalApplicationException(ex)) 
//                throw ex; 
//        }

        return result; 
    };
	
	PropertyPathWorker.Type = new Type("PropertyPathWorker", PropertyPathWorker, [IWeakEventListener.Type]);
	return PropertyPathWorker;
});




