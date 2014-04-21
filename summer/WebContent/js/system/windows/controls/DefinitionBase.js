/**
 * DefinitionBase
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkContentElement"], 
		function(declare, Type, FrameworkContentElement){
	
//    private enum 
	var Flags =declare(null, {});
    //  bool flags 
	Flags.UseSharedMinimum                    =   0x00000020;     //  when "1", definition will take into account shared state's minimum 
	Flags.LayoutWasUpdated                    =   0x00000040;     //  set to "1" every time the parent grid is measured 

    /// <summary>
    /// Collection of shared states objects for a single scope
    /// </summary>
//    private class 
	var SharedSizeScope = declare(null, {
        /// <summary> 
        /// Returns SharedSizeState object for a given group. 
        /// Creates a new StatedState object if necessary.
        /// </summary> 
//        internal SharedSizeState 
		EnsureSharedState:function(/*string*/ sharedSizeGroup)
        {
            //  check that sharedSizeGroup is not default
//            Debug.Assert(sharedSizeGroup != null); 

            /*SharedSizeState*/var sharedState = this._registry.Get(sharedSizeGroup);
            sharedState = sharedState instanceof SharedSizeState ? sharedState : null; 
            if (sharedState == null) 
            {
                sharedState = new SharedSizeState(this, sharedSizeGroup); 
                this._registry.Set(sharedSizeGroup, sharedState);
            }
            return (sharedState);
        },

        /// <summary> 
        /// Removes an entry in the registry by the given key. 
        /// </summary>
//        internal void 
        Remove:function(/*object*/ key) 
        {
//            Debug.Assert(_registry.Contains(key));
            this._registry.Remove(key);
        } 

//        private Hashtable _registry = new Hashtable();  //  storage for shared state objects 
    }); 

    /// <summary> 
    /// Implementation of per shared group state object
    /// </summary>
//    private class 
	var SharedSizeState = declare(null, { 
        /// <summary>
        /// Default ctor. 
        /// </summary> 
        constructor:function(/*SharedSizeScope*/ sharedSizeScope, /*string*/ sharedSizeGroupId)
        { 
//            Debug.Assert(sharedSizeScope != null && sharedSizeGroupId != null);
            this._sharedSizeScope = sharedSizeScope;
            this._sharedSizeGroupId = sharedSizeGroupId;
            this._registry = new List/*<DefinitionBase>*/(); 
            this._layoutUpdated = new EventHandler(this, this.OnLayoutUpdated);
            this._broadcastInvalidation = true; 
        }, 

        /// <summary> 
        /// Adds / registers a definition instance.
        /// </summary>
//        internal void 
		AddMember:function(/*DefinitionBase*/ member)
        { 
//            Debug.Assert(!_registry.Contains(member));
            this._registry.Add(member); 
            this.Invalidate(); 
        },

        /// <summary>
        /// Removes / un-registers a definition instance.
        /// </summary>
        /// <remarks> 
        /// If the collection of registered definitions becomes empty
        /// instantiates self removal from owner's collection. 
        /// </remarks> 
//        internal void 
        RemoveMember:function(/*DefinitionBase*/ member)
        { 
            this.Invalidate();
            this._registry.Remove(member);

            if (this._registry.Count == 0) 
            {
            	this._sharedSizeScope.Remove(this._sharedSizeGroupId); 
            } 
        },

        /// <summary>
        /// Propogates invalidations for all registered definitions.
        /// Resets its own state.
        /// </summary> 
//        internal void 
        Invalidate:function()
        { 
        	this._userSizeValid = false; 

            if (this._broadcastInvalidation) 
            {
                for (var i = 0, count = this._registry.Count; i < count; ++i)
                {
                    var parentGrid = this._registry.Get(i).Parent; 
                    parentGrid.Invalidate();
                } 
                this._broadcastInvalidation = false; 
            }
        }, 

        /// <summary>
        /// Makes sure that one and only one layout updated handler is registered for this shared state.
        /// </summary> 
//        internal void 
        EnsureDeferredValidation:function(/*UIElement*/ layoutUpdatedHost)
        { 
            if (this._layoutUpdatedHost == null) 
            {
            	this._layoutUpdatedHost = layoutUpdatedHost; 
            	this._layoutUpdatedHost.LayoutUpdated += _layoutUpdated;
            }
        },

//        private void 
        EnsureUserSizeValid:function()
        {
            this._userSize = new GridLength(1, GridUnitType.Auto); 

            for (var i = 0, count = _registry.Count; i < count; ++i) 
            { 
//                Debug.Assert(   _userSize.GridUnitType == GridUnitType.Auto
//                            ||  _userSize.GridUnitType == GridUnitType.Pixel    ); 

                var currentGridLength = this._registry[i].UserSizeValueCache;
                if (currentGridLength.GridUnitType == GridUnitType.Pixel)
                { 
                    if (this._userSize.GridUnitType == GridUnitType.Auto)
                    { 
                    	this._userSize = currentGridLength; 
                    }
                    else if (this._userSize.Value < currentGridLength.Value) 
                    {
                    	this._userSize = currentGridLength;
                    }
                } 
            }
            //  taking maximum with user size effectively prevents squishy-ness. 
            //  this is a "solution" to avoid shared definitions from been sized to 
            //  different final size at arrange time, if / when different grids receive
            //  different final sizes. 
            this._minSize = this._userSize.IsAbsolute ? this._userSize.Value : 0.0;

            this._userSizeValid = true;
        }, 

        /// <summary> 
        /// OnLayoutUpdated handler. Validates that all participating definitions 
        /// have updated min size value. Forces another layout update cycle if needed.
        /// </summary> 
//        private void 
        OnLayoutUpdated:function(/*object*/ sender, /*EventArgs*/ e)
        {
            var sharedMinSize = 0;

            //  accumulate min size of all participating definitions
            for (var i = 0, count = this._registry.Count; i < count; ++i) 
            { 
                sharedMinSize = Math.Max(sharedMinSize, this._registry.Get(i).MinSize);
            } 

            var sharedMinSizeChanged = !DoubleUtil.AreClose(this._minSize, sharedMinSize);

            //  compare accumulated min size with min sizes of the individual definitions 
            for (var i = 0, count = this._registry.Count; i < count; ++i)
            { 
            	var definitionBase = this._registry.Get(i); 

                if (sharedMinSizeChanged ||  definitionBase.LayoutWasUpdated) 
                {
                    //  if definition's min size is different, then need to re-measure
                    if (!DoubleUtil.AreClose(sharedMinSize, definitionBase.MinSize))
                    { 
                    	var parentGrid = definitionBase.Parent;
                        parentGrid.InvalidateMeasure(); 
                        definitionBase.UseSharedMinimum = true; 
                    }
                    else 
                    {
                        definitionBase.UseSharedMinimum = false;

                        //  if measure is valid then also need to check arrange. 
                        //  Note: definitionBase.SizeCache is volatile but at this point
                        //  it contains up-to-date final size 
                        if (!DoubleUtil.AreClose(sharedMinSize, definitionBase.SizeCache)) 
                        {
                            var parentGrid = definitionBase.Parent; 
                            parentGrid.InvalidateArrange();
                        }
                    }

                    definitionBase.LayoutWasUpdated = false;
                } 
            } 

            this._minSize = sharedMinSize; 

            this._layoutUpdatedHost.LayoutUpdated -= _layoutUpdated;
            this._layoutUpdatedHost = null;

            this._broadcastInvalidation = true;
        } 

//        private readonly SharedSizeScope _sharedSizeScope;  //  the scope this state belongs to
//        private readonly string _sharedSizeGroupId;         //  Id of the shared size group this object is servicing 
//        private readonly List<DefinitionBase> _registry;    //  registry of participating definitions
//        private readonly EventHandler _layoutUpdated;       //  instance event handler for layout updated event
//        private UIElement _layoutUpdatedHost;               //  UIElement for which layout updated event handler is registered
//        private bool _broadcastInvalidation;                //  "true" when broadcasting of invalidation is needed 
//        private bool _userSizeValid;                        //  "true" when _userSize is up to date
//        private GridLength _userSize;                       //  shared state 
//        private double _minSize;                            //  shared state 
    });
	
	Object.defineProperties(SharedSizeState.prototype, {
		 /// <summary>
        /// DefinitionBase's specific code. 
        /// </summary> 
//        internal double 
		MinSize:
        { 
            get:function()
            {
                if (!this._userSizeValid) { this.EnsureUserSizeValid(); }
                return (this._minSize); 
            }
        }, 

        /// <summary>
        /// DefinitionBase's specific code. 
        /// </summary>
//        internal GridLength 
        UserSize:
        {
            get:function() 
            {
                if (!this._userSizeValid) { this.EnsureUserSizeValid(); } 
                return (this._userSize); 
            }
        } 
	});
	
//    internal const bool 
	var ThisIsColumnDefinition = true;
//    internal const bool 
	var ThisIsRowDefinition = false; 
    
	var DefinitionBase = declare("DefinitionBase", FrameworkContentElement,{
		constructor:function(/*bool*/ isColumnDefinition) 
        {
            this._isColumnDefinition = isColumnDefinition; 
            this._parentIndex = -1; 
		},
		
		/// <summary>
        /// Callback to notify about entering model tree. 
        /// </summary>
//        internal void 
		OnEnterParentTree:function() 
        { 
            if (this._sharedState == null)
            { 
                //  start with getting SharedSizeGroup value.
                //  this property is NOT inhereted which should result in better overall perf.
                var sharedSizeGroupId = this.SharedSizeGroup;
                if (sharedSizeGroupId != null) 
                {
                    var privateSharedSizeScope = this.PrivateSharedSizeScope; 
                    if (privateSharedSizeScope != null) 
                    {
                    	this._sharedState = privateSharedSizeScope.EnsureSharedState(sharedSizeGroupId); 
                    	this._sharedState.AddMember(this);
                    }
                }
            } 
        },
 
        /// <summary> 
        /// Callback to notify about exitting model tree.
        /// </summary> 
//        internal void 
        OnExitParentTree:function()
        {
            this._offset = 0;
            if (this._sharedState != null) 
            {
            	this._sharedState.RemoveMember(this); 
            	this._sharedState = null; 
            }
        }, 

        /// <summary>
        /// Performs action preparing definition to enter layout calculation mode.
        /// </summary> 
//        internal void 
        OnBeforeLayout:function(/*Grid*/ grid)
        { 
            //  reset layout state. 
        	this._minSize = 0;
        	this.LayoutWasUpdated = true; 

            //  defer verification for shared definitions
            if (this._sharedState != null)   {   this._sharedState.EnsureDeferredValidation(grid);    }
        }, 

        /// <summary> 
        /// Updates min size. 
        /// </summary>
        /// <param name="minSize">New size.</param> 
//        internal void 
        UpdateMinSize:function(/*double*/ minSize)
        {
        	this._minSize = Math.max(this._minSize, minSize);
        }, 

        /// <summary> 
        /// Sets min size. 
        /// </summary>
        /// <param name="minSize">New size.</param> 
//        internal void 
        SetMinSize:function(/*double*/ minSize)
        {
        	this._minSize = minSize;
        },
      /// <summary>
        /// SetFlags is used to set or unset one or multiple 
        /// flags on the object.
        /// </summary> 
//        private void 
        SetFlags:function(/*bool*/ value, /*Flags*/ flags) 
        {
        	this._flags = value ? (this._flags | flags) : (this._flags & (~flags)); 
        },

        /// <summary>
        /// CheckFlagsAnd returns <c>true</c> if all the flags in the 
        /// given bitmask are set on the object.
        /// </summary> 
//        private bool 
        CheckFlagsAnd:function(/*Flags*/ flags) 
        {
            return ((this._flags & flags) == flags); 
        },
        
	});
	
	Object.defineProperties(DefinitionBase.prototype,{
		 /// <summary>
        /// SharedSizeGroup property.
        /// </summary> 
//        public string 
		SharedSizeGroup:
        { 
            get:function() { return this.GetValue(DefinitionBase.SharedSizeGroupProperty); }, 
            set:function(value) { this.SetValue(DefinitionBase.SharedSizeGroupProperty, value); }
        },
        
        /// <summary>
        /// Returns <c>true</c> if this definition is a part of shared group.
        /// </summary>
//        internal bool 
        IsShared: 
        {
            get:function() { return (this._sharedState != null); } 
        }, 

        /// <summary> 
        /// Internal accessor to user size field.
        /// </summary>
//        internal GridLength 
        UserSize:
        { 
            get:function() { return (this._sharedState != null ? this._sharedState.UserSize : this.UserSizeValueCache); }
        }, 
 
        /// <summary>
        /// Internal accessor to user min size field. 
        /// </summary>
//        internal double 
        UserMinSize:
        {
            get:function() { return (this.UserMinSizeValueCache); } 
        },
 
        /// <summary> 
        /// Internal accessor to user max size field.
        /// </summary> 
//        internal double 
        UserMaxSize:
        {
            get:function() { return (this.UserMaxSizeValueCache); }
        }, 

        /// <summary> 
        /// DefinitionBase's index in the parents collection. 
        /// </summary>
//        internal int 
        Index:
        {
            get:function()
            {
                return (this._parentIndex); 
            },
            set:function(value) 
            { 
            	this._parentIndex = value; 
            }
        },

        /// <summary> 
        /// Layout-time user size type.
        /// </summary> 
//        internal Grid.LayoutTimeSizeType 
        SizeType: 
        {
            get:function() { return (this._sizeType); }, 
            set:function(value) { this._sizeType = value; }
        },

        /// <summary> 
        /// Returns or sets measure size for the definition.
        /// </summary> 
//        internal double 
        MeasureSize: 
        {
            get:function() { return (this._measureSize); }, 
            set:function(value) { this._measureSize = value; }
        },

        /// <summary> 
        /// Returns definition's layout time type sensitive preferred size.
        /// </summary> 
        /// <remarks> 
        /// Returned value is guaranteed to be true preferred size.
        /// </remarks> 
//        internal double 
        PreferredSize:
        {
            get:function()
            { 
                var preferredSize = MinSize;
                if (    this._sizeType != Grid.LayoutTimeSizeType.Auto 
                    &&  preferredSize < this._measureSize    ) 
                {
                    preferredSize = this._measureSize; 
                }
                return (preferredSize);
            }
        }, 

        /// <summary> 
        /// Returns or sets size cache for the definition. 
        /// </summary>
//        internal double 
        SizeCache: 
        {
            get:function() { return (this._sizeCache); },
            set:function(value) { this._sizeCache = value; }
        },

        /// <summary> 
        /// Returns min size. 
        /// </summary>
//        internal double 
        MinSize: 
        {
            get:function()
            {
                var minSize = this._minSize; 
                if (    this.UseSharedMinimum
                    &&  this._sharedState != null 
                    &&  minSize < this._sharedState.MinSize  ) 
                {
                    minSize = this._sharedState.MinSize; 
                }
                return (minSize);
            }
        }, 

        /// <summary> 
        /// Returns min size, always taking into account shared state. 
        /// </summary>
//        internal double 
        MinSizeForArrange: 
        {
            get:function()
            {
                var minSize = this._minSize; 
                if (    this._sharedState != null
                    &&  (this.UseSharedMinimum || !this.LayoutWasUpdated) 
                    &&  minSize < this._sharedState.MinSize  ) 
                {
                    minSize = this._sharedState.MinSize; 
                }
                return (minSize);
            }
        }, 

        /// <summary> 
        /// Offset. 
        /// </summary>
//        internal double 
        FinalOffset: 
        {
            get:function() { return this._offset; },
            set:function(value) { this._offset = value; }
        }, 

        /// <summary> 
        /// Internal helper to access up-to-date UserSize property value. 
        /// </summary>
//        internal GridLength 
        UserSizeValueCache: 
        {
            get:function()
            {
                return this.GetValue( 
                		this._isColumnDefinition ?
                        ColumnDefinition.WidthProperty : 
                        RowDefinition.HeightProperty); 
            }
        }, 

        /// <summary>
        /// Internal helper to access up-to-date UserMinSize property value.
        /// </summary> 
//        internal double 
        UserMinSizeValueCache:
        { 
            get:function() 
            {
                return this.GetValue( 
                		this._isColumnDefinition ?
                        ColumnDefinition.MinWidthProperty :
                        RowDefinition.MinHeightProperty);
            } 
        },
 
        /// <summary> 
        /// Internal helper to access up-to-date UserMaxSize property value.
        /// </summary> 
//        internal double 
        UserMaxSizeValueCache:
        {
            get:function()
            { 
                return this.GetValue(
                		this._isColumnDefinition ? 
                        ColumnDefinition.MaxWidthProperty : 
                        RowDefinition.MaxHeightProperty);
            } 
        },

        /// <summary>
        /// Protected. Returns <c>true</c> if this DefinitionBase instance is in parent's logical tree. 
        /// </summary>
//        internal bool 
        InParentLogicalTree: 
        { 
            get:function() { return (this._parentIndex != -1); }
        },
        
      /// <summary>
        /// Private getter of shared state collection dynamic property.
        /// </summary> 
//        private SharedSizeScope 
        PrivateSharedSizeScope:
        { 
            get:function() { return this.GetValue(PrivateSharedSizeScopeProperty); } 
        },
 
        /// <summary>
        /// Convenience accessor to UseSharedMinimum flag
        /// </summary>
//        private bool 
        UseSharedMinimum: 
        {
            get:function() { return (this.CheckFlagsAnd(Flags.UseSharedMinimum)); }, 
            set:function(value) { this.SetFlags(value, Flags.UseSharedMinimum); } 
        },
 
        /// <summary>
        /// Convenience accessor to LayoutWasUpdated flag
        /// </summary>
//        private bool 
        LayoutWasUpdated: 
        {
            get:function() { return (this.CheckFlagsAnd(Flags.LayoutWasUpdated)); }, 
            set:function(value) { this.SetFlags(value, Flags.LayoutWasUpdated); } 
        }
	});
	
	Object.defineProperties(DefinitionBase,{
		/// <summary>
        /// Private shared size scope property holds a collection of shared state objects for the a given shared size scope.
        /// <see cref="OnIsSharedSizeScopePropertyChanged"/> 
        /// </summary>
//        internal static readonly DependencyProperty 
		PrivateSharedSizeScopeProperty:
        {
        	get:function(){
        		if(DefinitionBase._IsSelectedProperty === undefined){
        			DefinitionBase._IsSelectedProperty = 
                        DependencyProperty.RegisterAttached( 
                                "PrivateSharedSizeScope",
                                SharedSizeScope.Type, 
                                DefinitionBase.Type,
                                /*new FrameworkPropertyMetadata(
                                        null,
                                        FrameworkPropertyMetadataOptions.Inherits)*/
                                FrameworkPropertyMetadata.Build2(
                                        null,
                                        FrameworkPropertyMetadataOptions.Inherits)); 
        		}
        		
        		return DefinitionBase._IsSelectedProperty;
        	}
        },  

        /// <summary> 
        /// Shared size group property marks column / row definition as belonging to a group "Foo" or "Bar". 
        /// </summary>
        /// <remarks> 
        /// Value of the Shared Size Group Property must satisfy the following rules:
        /// <list type="bullet">
        /// <item><description>
        /// String must not be empty. 
        /// </description></item>
        /// <item><description> 
        /// String must consist of letters, digits and underscore ('_') only. 
        /// </description></item>
        /// <item><description> 
        /// String must not start with a digit.
        /// </description></item>
        /// </list>
        /// </remarks> 
//        public static readonly DependencyProperty 
		SharedSizeGroupProperty:
        {
        	get:function(){
        		if(DefinitionBase._SharedSizeGroupProperty === undefined){
        			DefinitionBase._SharedSizeGroupProperty =
                        DependencyProperty.Register( 
                                "SharedSizeGroup", 
                                String.Type,
                                DefinitionBase.Type, 
                                /*new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnSharedSizeGroupPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithPCCB(new PropertyChangedCallback(null, OnSharedSizeGroupPropertyChanged)),
                                new ValidateValueCallback(null, SharedSizeGroupPropertyValueValid));
        		}
        		
        		return DefinitionBase._SharedSizeGroupProperty;
        	}
        },  		  
	});
	
    /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary>
    /// <remarks> 
    /// This method needs to be internal to be accessable from derived classes.
    /// </remarks>
//    internal static void 
	DefinitionBase.OnUserSizePropertyChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
		if(e.NewValue.Value<=0){
			d._dom.style.setProperty("display", "none");
		}else{
			d._dom.style.setProperty("display", "");
		}
		
        if (d.InParentLogicalTree) 
        {

            if (d._sharedState != null)
            {
                d._sharedState.Invalidate();
            } 
            else
            { 
                var parentGrid = d.Parent; 

                if ((e.OldValue).GridUnitType != (e.NewValue).GridUnitType) 
                {
                    parentGrid.Invalidate();
                }
                else 
                {
                    parentGrid.InvalidateMeasure(); 
                } 
            }
        } 
    };

    /// <summary>
    /// <see cref="DependencyProperty.ValidateValueCallback"/> 
    /// </summary>
    /// <remarks> 
    /// This method needs to be internal to be accessable from derived classes. 
    /// </remarks>
//    internal static bool 
    DefinitionBase.IsUserSizePropertyValueValid = function(/*object*/ value) 
    {
        return ((value).Value >= 0);
    };

    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary> 
    /// <remarks>
    /// This method needs to be internal to be accessable from derived classes. 
    /// </remarks>
//    internal static void 
    DefinitionBase.OnUserMinSizePropertyChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        if (d.InParentLogicalTree) 
        { 
            var parentGrid = /*(Grid)*/ d.Parent;
            parentGrid.InvalidateMeasure(); 
        }
    };

    /// <summary> 
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary> 
    /// <remarks> 
    /// This method needs to be internal to be accessable from derived classes.
    /// </remarks> 
//    internal static bool 
    DefinitionBase.IsUserMinSizePropertyValueValid = function(/*object*/ value)
    {
        return (!DoubleUtil.IsNaN(value) && value >= 0.0 && !Double.IsPositiveInfinity(value)); 
    };

    /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary> 
    /// <remarks>
    /// This method needs to be internal to be accessable from derived classes.
    /// </remarks>
//    internal static void 
    DefinitionBase.OnUserMaxSizePropertyChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (d.InParentLogicalTree)
        { 
            var parentGrid = /*(Grid)*/ d.Parent;
            parentGrid.InvalidateMeasure();
        }
    }; 

    /// <summary> 
    /// <see cref="DependencyProperty.ValidateValueCallback"/> 
    /// </summary>
    /// <remarks> 
    /// This method needs to be internal to be accessable from derived classes.
    /// </remarks>
//    internal static bool 
    DefinitionBase.IsUserMaxSizePropertyValueValid = function(/*object*/ value)
    { 
        return (!DoubleUtil.IsNaN(value) && value >= 0.0); 
    };

    /// <summary> 
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/>
    /// </summary>
    /// <remarks>
    /// This method reflects Grid.SharedScopeProperty state by setting / clearing 
    /// dynamic property PrivateSharedSizeScopeProperty. Value of PrivateSharedSizeScopeProperty
    /// is a collection of SharedSizeState objects for the scope. 
    /// Also PrivateSharedSizeScopeProperty is FrameworkPropertyMetadataOptions.Inherits property. So that all children 
    /// elements belonging to a certain scope can easily access SharedSizeState collection. As well
    /// as been norified about enter / exit a scope. 
    /// </remarks>
//    internal static void 
    DefinitionBase.OnIsSharedSizeScopePropertyChanged = function(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        if (e.NewValue) 
        {
            var sharedStatesCollection = new SharedSizeScope(); 
            d.SetValue(PrivateSharedSizeScopeProperty, sharedStatesCollection);
        }
        else
        { 
            d.ClearValue(PrivateSharedSizeScopeProperty);
        } 
    }; 
    
    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary>
//    private static void
    function OnSharedSizeGroupPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        if (d.InParentLogicalTree)
        {
            var sharedSizeGroupId = e.NewValue;

            if (d._sharedState != null)
            { 
                //  if definition is already registered AND shared size group id is changing, 
                //  then un-register the definition from the current shared size state object.
                d._sharedState.RemoveMember(d); 
                d._sharedState = null;
            }

            if ((d._sharedState == null) && (sharedSizeGroupId != null)) 
            {
                var privateSharedSizeScope = d.PrivateSharedSizeScope; 
                if (privateSharedSizeScope != null) 
                {
                    //  if definition is not registered and both: shared size group id AND private shared scope 
                    //  are available, then register definition.
                    d._sharedState = privateSharedSizeScope.EnsureSharedState(sharedSizeGroupId);
                    d._sharedState.AddMember(d);
                } 
            }
        } 
    } 

    /// <summary> 
    /// <see cref="DependencyProperty.ValidateValueCallback"/>
    /// </summary>
    /// <remarks>
    /// Verifies that Shared Size Group Property string 
    /// a) not empty.
    /// b) contains only letters, digits and underscore ('_'). 
    /// c) does not start with a digit. 
    /// </remarks>
//    private static bool 
    function SharedSizeGroupPropertyValueValid(/*object*/ value) 
    {
        //  null is default value
        if (value == null)
        { 
            return (true);
        } 

        if (value != String.Empty)
        {
            var i = -1;
            while (++i < value.length) 
            {
                var isDigit = Char.IsDigit(value[i]); 

                if (    (i == 0 && isDigit)
                    ||  !(  isDigit 
                        ||  Char.IsLetter(value[i])
                        ||  '_' == id[i]    )   )
                {
                    break; 
                }
            } 

            if (i == value.length)
            { 
                return (true);
            }
        }

        return (false);
    } 

    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary>
    /// <remark>
    /// OnPrivateSharedSizeScopePropertyChanged is called when new scope enters or
    /// existing scope just left. In both cases if the DefinitionBase object is already registered 
    /// in SharedSizeState, it should un-register and register itself in a new one.
    /// </remark> 
//    private static void 
    function OnPrivateSharedSizeScopePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (d.InParentLogicalTree)
        {
            var privateSharedSizeScope = /*(SharedSizeScope)*/ e.NewValue; 

            if (d._sharedState != null) 
            { 
                //  if definition is already registered And shared size scope is changing,
                //  then un-register the definition from the current shared size state object. 
                d._sharedState.RemoveMember(d);
                d._sharedState = null;
            }

            if ((d._sharedState == null) && (privateSharedSizeScope != null))
            { 
                var sharedSizeGroup = d.SharedSizeGroup; 
                if (sharedSizeGroup != null)
                { 
                    //  if definition is not registered and both: shared size group id AND private shared scope
                    //  are available, then register definition.
                    d._sharedState = privateSharedSizeScope.EnsureSharedState(d.SharedSizeGroup);
                    d._sharedState.AddMember(d); 
                }
            } 
        } 
    }


    /// <summary> 
    /// Static ctor. Used for static registration of properties.
    /// </summary> 
//    static DefinitionBase() 
    function Initialize(){
    	DefinitionBase.PrivateSharedSizeScopeProperty.OverrideMetadata( 
                DefinitionBase.Type,
                new FrameworkPropertyMetadata(new PropertyChangedCallback(null, OnPrivateSharedSizeScopePropertyChanged)));
    }
    
	
	DefinitionBase.Type = new Type("DefinitionBase", DefinitionBase, [FrameworkContentElement.Type]);
	return DefinitionBase;
});


        
//        private readonly bool _isColumnDefinition;      //  when "true", this is a ColumnDefinition; when "false" this is a RowDefinition (faster than a type check)
//        private Flags _flags;                           //  flags reflecting various aspects of internal state
//        private int _parentIndex;                       //  this instance's index in parent's children collection
// 
//        private Grid.LayoutTimeSizeType _sizeType;      //  layout-time user size type. it may differ from _userSizeValueCache.UnitType when calculating "to-content"
// 
//        private double _minSize;                        //  used during measure to accumulate size for "Auto" and "Star" DefinitionBase's 
//        private double _measureSize;                    //  size, calculated to be the input contstraint size for Child.Measure
//        private double _sizeCache;                      //  cache used for various purposes (sorting, caching, etc) during calculations 
//        private double _offset;                         //  offset of the DefinitionBase from left / top corner (assuming LTR case)
//
//        private SharedSizeState _sharedState;           //  reference to shared state object this instance is registered with
// 

        


