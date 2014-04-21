/**
 * Second Check 2013-12-07
 * Panel
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "markup/IAddChild",
        "windows/DependencyProperty", "windows/FrameworkPropertyMetadata", "windows/PropertyChangedCallback",
        "controls/UIElementCollection", "media/Brush"], 
		function(declare, Type, FrameworkElement, IAddChild,
				DependencyProperty, FrameworkPropertyMetadata, PropertyChangedCallback,
				UIElementCollection, Brush){
	
	var ItemsControl = null;
	function EnsureItemsControl(){
		if(ItemsControl == null){
			ItemsControl = using("controls/ItemsControl");
		}
		
		return ItemsControl;
	}
	
    var BoolField  =  declare("BoolField", Object,{});
    BoolField.IsZStateDirty                               = 0x01;   //  "1" when Z state needs to be recomputed
    BoolField.IsZStateDiverse                             = 0x02;   //  "1" when children have different ZIndexProperty values 
    BoolField.IsVirtualizing                              = 0x04;   //  Used by VirtualizingStackPanel
    BoolField.HasMeasured                                 = 0x08;   //  Used by VirtualizingStackPanel
    BoolField.IsPixelBased                                = 0x10;   //  Used by VirtualizingStackPanel
    BoolField.InRecyclingMode                             = 0x20;   //  Used by VirtualizingStackPanel 
    BoolField.MustDisableVirtualization                   = 0x40;   //  Used by VirtualizingStackPanel
    BoolField.MeasureCaches                               = 0x80;   //  Used by VirtualizingStackPanel  
	
//    private const int 
    var c_zDefaultValue = 0;              //  default ZIndexProperty value 
	var Panel = declare("Panel", [FrameworkElement, IAddChild],{
		constructor:function(){
			this._zConsonant = Panel.ZIndexProperty.GetDefaultValue(this.DependencyObjectType); 
			
//	        private UIElementCollection 
	        this._uiElementCollection = null; 
//	        private ItemContainerGenerator 
	        this._itemContainerGenerator = null;
//	        private BoolField 
	        this._boolFieldStore = 0;


//	        private int[] 
	        this._zLut = null;   

		},
        /// <summary>
        ///     Fills in the background based on the Background property. 
        /// </summary>
//        protected override void 
        OnRender:function(/*DrawingContext*/ dc)
        {
            var background = this.Background; 
            if (background != null)
            { 
                // Using the Background brush, draw a rectangle that fills the 
                // render bounds of the panel.
                var renderSize = RenderSize; 
                dc.DrawRectangle(background,
                                 null,
                                 new Rect(0.0, 0.0, renderSize.Width, renderSize.Height));
            } 
        },
 
        ///<summary> 
        /// This method is called to Add the object as a child of the Panel.  This method is used primarily
        /// by the parser. 
        ///</summary>
        ///<param name="value">
        /// The object to add as a child; it must be a UIElement.
        ///</param> 
        /// <ExternalAPI/>
//        void IAddChild.
        AddChild:function (/*Object*/ value) 
        { 
            if (value == null)
            { 
                throw new ArgumentNullException("value");
            }
            if(this.IsItemsHost)
            { 
                throw new Error('InvalidOperationException(SR.Get(SRID.Panel_BoundPanel_NoChildren)');
            } 
 
            /*UIElement*/
            var uie = value instanceof UIElement ? value : null;
 
            if (uie == null)
            {
                throw new Error('ArgumentException(SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(UIElement)), "value")');
            } 

            this.Children.Add(uie); 
        },
     
        ///<summary> 
        /// This method is called by the parser when text appears under the tag in markup.
        /// As default Panels do not support text, calling this method has no effect.
        ///</summary>
        ///<param name="text"> 
        /// Text to add as a child.
        ///</param> 
//        void IAddChild.
        AddText:function (/*string*/ text) 
        {
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },
        
        /// <summary>
        ///     This method is invoked when the IsItemsHost property changes. 
        /// </summary>
        /// <param name="oldIsItemsHost">The old value of the IsItemsHost property.</param> 
        /// <param name="newIsItemsHost">The new value of the IsItemsHost property.</param> 
//        protected virtual void 
        OnIsItemsHostChanged:function(/*bool*/ oldIsItemsHost, /*bool*/ newIsItemsHost)
        { 
            // GetItemsOwner will check IsItemsHost first, so we don't have
            // to check that IsItemsHost == true before calling it.
            /*DependencyObject*/var parent = EnsureItemsControl().GetItemsOwnerInternal(this);
            /*ItemsControl*/var itemsControl = parent instanceof EnsureItemsControl() ? parent : null; 
            /*Panel*/var oldItemsHost = null;
 
            if (itemsControl != null) 
            {
                // ItemsHost should be the "root" element which has 
                // IsItemsHost = true on it.  In the case of grouping,
                // IsItemsHost is true on all panels which are generating
                // content.  Thus, we care only about the panel which
                // is generating content for the ItemsControl. 
                /*IItemContainerGenerator*/
            	var generator = itemsControl.ItemContainerGenerator;
            	generator = generator instanceof IItemContainerGenerator ? generator : null;
                if (generator != null && generator == generator.GetItemContainerGeneratorForPanel(this)) 
                { 
                    oldItemsHost = itemsControl.ItemsHost;
                    itemsControl.ItemsHost = this; 
                }
            }
            else
            { 
                /*GroupItem*/var groupItem = parent instanceof GroupItem ? parent : null;
                if (groupItem != null) 
                { 
                    /*IItemContainerGenerator*/
                	var generator = groupItem.Generator;
                	generator = generator.isInstanceOf(IItemContainerGenerator) ? generator : null;
                    if (generator != null && generator == generator.GetItemContainerGeneratorForPanel(this)) 
                    {
                        oldItemsHost = groupItem.ItemsHost;
                        groupItem.ItemsHost = this;
                    } 
                }
            } 
 
            if (oldItemsHost != null && oldItemsHost != this)
            { 
                // when changing ItemsHost panels, disconnect the old one
                oldItemsHost.VerifyBoundState();
            }
 
            this.VerifyBoundState();
        },
        
        /// <summary>
        /// Gets the Visual child at the specified index.
        /// </summary>
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if (this._uiElementCollection == null) 
            { 
                throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)');
            } 

            if (this.IsZStateDirty) { this.RecomputeZState(); }
            var visualIndex = this._zLut != null ? this._zLut[index] : index;
            return this._uiElementCollection.Get(visualIndex); 
        },
 
        /// <summary> 
        /// Creates a new UIElementCollection. Panel-derived class can create its own version of
        /// UIElementCollection -derived class to add cached information to every child or to 
        /// intercept any Add/Remove actions (for example, for incremental layout update)
        /// </summary>
//        protected virtual UIElementCollection 
        CreateUIElementCollection:function(/*FrameworkElement*/ logicalParent)
        { 
            return new UIElementCollection(this, logicalParent);
        },
        
//        private bool 
        VerifyBoundState:function() 
        {
            // If the panel becomes "unbound" while attached to a generator, this 
            // method detaches it and makes it really behave like "unbound."  This
            // can happen because of a style change, a theme change, etc. It returns
            // the correct "bound" state, after the dust has settled.
            // 
            // This is really a workaround for a more general problem that the panel
            // needs to release resources (an event handler) when it is "out of the tree." 
            // Currently, there is no good notification for when this happens. 

            var isItemsHost = (EnsureItemsControl().GetItemsOwnerInternal(this) != null); 

            if (isItemsHost)
            {
                if (this._itemContainerGenerator == null) 
                {
                    // Transitioning from being unbound to bound 
                	this.ClearChildren(); 
                }
 
                return (this._itemContainerGenerator != null);
            }
            else
            { 
                if (this._itemContainerGenerator != null)
                { 
                    // Transitioning from being bound to unbound 
                	this.DisconnectFromGenerator();
                	this.ClearChildren(); 
                }

                return false;
            } 
        },
     
//        private void 
        ConnectToGenerator:function()
        {
//            Debug.Assert(_itemContainerGenerator == null, "Attempted to connect to a generator when Panel._itemContainerGenerator is non-null.");
 
            /*ItemsControl*/var itemsOwner = EnsureItemsControl().GetItemsOwner(this);
            if (itemsOwner == null) 
            { 
                // This can happen if IsItemsHost=true, but the panel is not nested in an ItemsControl
                throw new Error('InvalidOperationException(SR.Get(SRID.Panel_ItemsControlNotFound)'); 
            }

            /*IItemContainerGenerator*/var itemsOwnerGenerator = itemsOwner.ItemContainerGenerator;
            if (itemsOwnerGenerator != null) 
            {
            	this._itemContainerGenerator = itemsOwnerGenerator.GetItemContainerGeneratorForPanel(this); 
                if (this._itemContainerGenerator != null) 
                {
                	this._itemContainerGenerator.ItemsChanged.Combine(new ItemsChangedEventHandler(this, this.OnItemsChanged)); 
                    /*((IItemContainerGenerator)*/this._itemContainerGenerator.RemoveAll();
                }
            }
        }, 
   
//        private void 
        DisconnectFromGenerator:function() 
        { 
//            Debug.Assert(_itemContainerGenerator != null, "Attempted to disconnect from a generator when Panel._itemContainerGenerator is null.");
 
            this._itemContainerGenerator.ItemsChanged.Remove(new ItemsChangedEventHandler(this, this.OnItemsChanged));
            /*((IItemContainerGenerator)*/this._itemContainerGenerator.RemoveAll();
            this._itemContainerGenerator = null;
        }, 

//        private void 
        EnsureEmptyChildren:function(/*FrameworkElement*/ logicalParent) 
        { 
            if ((this._uiElementCollection == null) || (this._uiElementCollection.LogicalParent != logicalParent))
            { 
            	this._uiElementCollection = this.CreateUIElementCollection(logicalParent);
            }
            else
            { 
            	this.ClearChildren();
            } 
        }, 

//        internal void 
        EnsureGenerator:function() 
        {
//            Debug.Assert(IsItemsHost, "Should be invoked only on an ItemsHost panel");

            if (this._itemContainerGenerator == null) 
            {
                // First access on an items presenter panel 
            	this.ConnectToGenerator(); 

                // Children of this panel should not have their logical parent reset 
            	this.EnsureEmptyChildren(/* logicalParent = */ null);

            	this.GenerateChildren();
            } 
        },
 
//        private void 
        ClearChildren:function()
        { 
            if (this._itemContainerGenerator != null)
            {
                /*((IItemContainerGenerator)_itemContainerGenerator)*/this._itemContainerGenerator.RemoveAll();
            } 

            if ((this._uiElementCollection != null) && (this._uiElementCollection.Count > 0)) 
            { 
            	this._uiElementCollection.ClearInternal();
            	this.OnClearChildrenInternal(); 
            }
        },
//        internal virtual void 
        OnClearChildrenInternal:function() 
        {
        }, 
 
//        internal virtual void 
        GenerateChildren:function()
        { 
            // This method is typically called during layout, which suspends the dispatcher.
            // Firing an assert causes an exception "Dispatcher processing has been suspended, but messages are still being processed."
            // Besides, the asserted condition can actually arise in practice, and the
            // code responds harmlessly. 
            //Debug.Assert(_itemContainerGenerator != null, "Encountered a null _itemContainerGenerator while being asked to generate children.");
        	
        	
            /*IItemContainerGenerator*/var generator = this._itemContainerGenerator; 
            if (generator != null)
            { 
//                using (generator.StartAt(new GeneratorPosition(-1, 0), GeneratorDirection.Forward))
//                {
//                    UIElement child;
//                    while ((child = generator.GenerateNext() as UIElement) != null) 
//                    {
//                        _uiElementCollection.AddInternal(child); 
//                        generator.PrepareItemContainer(child); 
//                    }
//                } 
            	var dispose = generator.StartAt(new GeneratorPosition(-1, 0), GeneratorDirection.Forward);
            	try{
	                /*UIElement*/var child;
	                while (((child = generator.GenerateNext()) instanceof UIElement ? child : null)!=null) 
	                {
	                    this._uiElementCollection.AddInternal(child); 
	                    generator.PrepareItemContainer(child); 
	                }
            	}finally{
                    dispose.Dispose();
            	}

            }
        },

//        private void 
        OnItemsChanged:function(/*object*/ sender, /*ItemsChangedEventArgs*/ args) 
        {
            if (this.VerifyBoundState()) 
            { 
//                Debug.Assert(_itemContainerGenerator != null, "Encountered a null _itemContainerGenerator while receiving an ItemsChanged from a generator.");
 
                /*bool*/var affectsLayout = this.OnItemsChangedInternal(sender, args);

                if (affectsLayout)
                { 
                	this.InvalidateMeasure();
                } 
            } 
        },
 
        // This method returns a bool to indicate if or not the panel layout is affected by this collection change
//        internal virtual bool 
        OnItemsChangedInternal:function(/*object*/ sender, /*ItemsChangedEventArgs*/ args)
        {
            switch (args.Action) 
            {
                case NotifyCollectionChangedAction.Add: 
                	this.AddChildren(args.Position, args.ItemCount); 
                    break;
                case NotifyCollectionChangedAction.Remove: 
                	this.RemoveChildren(args.Position, args.ItemUICount);
                    break;
                case NotifyCollectionChangedAction.Replace:
                	this.ReplaceChildren(args.Position, args.ItemCount, args.ItemUICount); 
                    break;
                case NotifyCollectionChangedAction.Move: 
                	this.MoveChildren(args.OldPosition, args.Position, args.ItemUICount); 
                    break;
 
                case NotifyCollectionChangedAction.Reset:
                	this.ResetChildren();
                    break;
            } 

            return true; 
        }, 

//        private void 
        AddChildren:function(/*GeneratorPosition*/ pos, /*int*/ itemCount) 
        {
//            Debug.Assert(_itemContainerGenerator != null, "Encountered a null _itemContainerGenerator while receiving an Add action from a generator.");

            /*IItemContainerGenerator*/var generator = this._itemContainerGenerator; 
//            using (generator.StartAt(pos, GeneratorDirection.Forward))
//            { 
//                for (int i = 0; i < itemCount; i++) 
//                {
//                    UIElement e = generator.GenerateNext() as UIElement; 
//                    if(e != null)
//                    {
//                        _uiElementCollection.InsertInternal(pos.Index + 1 + i, e);
//                        generator.PrepareItemContainer(e); 
//                    }
//                    else 
//                    { 
//                        _itemContainerGenerator.Verify();
//                    } 
//                }
//            }
            
        	var dispose = generator.StartAt(pos, GeneratorDirection.Forward);
        	try{
                for (var i = 0; i < itemCount; i++) 
                {
                    var e = generator.GenerateNext();
                    e = e instanceof UIElement ?  e: null; 
                    if(e != null)
                    {
                    	generator.PrepareItemContainer(e); 
                        this._uiElementCollection.InsertInternal(pos.Index + 1 + i, e);
                    }
                    else 
                    { 
                        this._itemContainerGenerator.Verify();
                    } 
                }
        	}
            finally{
                dispose.Dispose();
            }
        },
 
//        private void 
        RemoveChildren:function(/*GeneratorPosition*/ pos, /*int*/ containerCount)
        { 
            // If anything is wrong, I think these collections should do parameter checking 
            this._uiElementCollection.RemoveRangeInternal(pos.Index, containerCount);
        }, 

//        private void 
        ReplaceChildren:function(/*GeneratorPosition*/ pos, /*int*/ itemCount, /*int*/ containerCount)
        {
//            Debug.Assert(itemCount == containerCount, "Panel expects Replace to affect only realized containers"); 
//            Debug.Assert(_itemContainerGenerator != null, "Encountered a null _itemContainerGenerator while receiving an Replace action from a generator.");
 
            /*IItemContainerGenerator*/var generator = this._itemContainerGenerator; 
//            using (generator.StartAt(pos, GeneratorDirection.Forward, true))
//            { 
//                for (int i = 0; i < itemCount; i++)
//                {
//                    bool isNewlyRealized;
//                    UIElement e = generator.GenerateNext(out isNewlyRealized) as UIElement; 
//
//                    Debug.Assert(e != null && !isNewlyRealized, "Panel expects Replace to affect only realized containers"); 
//                    if(e != null && !isNewlyRealized) 
//                    {
//                        _uiElementCollection.SetInternal(pos.Index + i, e); 
//                        generator.PrepareItemContainer(e);
//                    }
//                    else
//                    { 
//                        _itemContainerGenerator.Verify();
//                    } 
//                } 
//            }
            
        	var dispose = generator.StartAt(pos, GeneratorDirection.Forward, true);
        	try{
                for (var i = 0; i < itemCount; i++)
                {
                    var isNewlyRealized;
                    var isNewlyRealizedOut = {
                    	"isNewlyRealized" : isNewlyRealized
                    };
                    var e = generator.GenerateNext(/*out isNewlyRealized*/isNewlyRealizedOut);
                    isNewlyRealized = isNewlyRealizedOut.isNewlyRealized;
                    
                    e = e instanceof UIElement ? e : null; 

//                    Debug.Assert(e != null && !isNewlyRealized, "Panel expects Replace to affect only realized containers"); 
                    if(e != null && !isNewlyRealized) 
                    {
                        this._uiElementCollection.SetInternal(pos.Index + i, e); 
                        generator.PrepareItemContainer(e);
                    }
                    else
                    { 
                        this._itemContainerGenerator.Verify();
                    } 
                }
        	}finally{
                dispose.Dispose();
        	}
        }, 

//        private void 
        MoveChildren:function(/*GeneratorPosition*/ fromPos, /*GeneratorPosition*/ toPos, /*int*/ containerCount)
        {
            if (fromPos == toPos) 
                return;
 
//            Debug.Assert(_itemContainerGenerator != null, "Encountered a null _itemContainerGenerator while receiving an Move action from a generator."); 

            /*IItemContainerGenerator*/var generator = this._itemContainerGenerator; 
            var toIndex = generator.IndexFromGeneratorPosition(toPos);

            /*UIElement[]*/var elements = []; //new UIElement[containerCount];
 
            for (var i = 0; i < containerCount; i++)
                elements[i] = this._uiElementCollection.Get(fromPos.Index + i); 
 
            this._uiElementCollection.RemoveRangeInternal(fromPos.Index, containerCount);
 
            for (var i = 0; i < containerCount; i++)
            {
                this._uiElementCollection.InsertInternal(toIndex + i, elements[i]);
            } 
        },
 
//        private void 
        ResetChildren:function() 
        {
            this.EnsureEmptyChildren(null); 
            this.GenerateChildren();
        },

//        private bool 
        GetBoolField:function(/*BoolField*/ field) 
        {
            return (this._boolFieldStore & field) != 0; 
        }, 

//        private void 
        SetBoolField:function(/*BoolField*/ field, /*bool*/ value) 
        {
            if (value)
            {
                 this._boolFieldStore |= field; 
            }
            else 
            { 
                 this._boolFieldStore &= (~field);
            } 
        },
        
        /// <summary>
        /// <see cref="Visual.OnVisualChildrenChanged"/> 
        /// </summary>
//        protected internal override void 
        OnVisualChildrenChanged:function( 
            /*DependencyObject*/ visualAdded, 
            /*DependencyObject*/ visualRemoved)
        { 
            if (!this.IsZStateDirty)
            {
                if (this.IsZStateDiverse)
                { 
                    //  if children have different ZIndex values,
                    //  then _zLut have to be recomputed 
                    this.IsZStateDirty = true; 
                }
                else if (visualAdded != null) 
                {
                    //  if current children have consonant ZIndex values,
                    //  then _zLut have to be recomputed, only if the new
                    //  child makes z state diverse 
                    /*int*/var zNew = visualAdded.GetValue(Panel.ZIndexProperty);
                    if (zNew != this._zConsonant) 
                    { 
                        this.IsZStateDirty = true;
                    } 
                }
            }

//            base.OnVisualChildrenChanged(visualAdded, visualRemoved); 
            FrameworkElement.prototype.OnVisualChildrenChanged.call(this, visualAdded, visualRemoved);
            // Recompute the zLut array and invalidate children rendering order.
            if (this.IsZStateDirty) 
            { 
                this.RecomputeZState();
                this.InvalidateZState(); 
            }
        },
        
        /// <summary>
        /// Sets the Z state to be dirty
        /// </summary>
//        internal void 
        InvalidateZState:function() 
        {
            if (!this.IsZStateDirty 
             && this._uiElementCollection != null) 
            {
            	this.InvalidateZOrder(); 
            }

            this.IsZStateDirty = true;
        },

        //  Helper method to update this panel's state related to children rendering order handling 
//        private void 
        RecomputeZState:function()
        {
            var  count = (this._uiElementCollection != null) ? this._uiElementCollection.Count : 0;
            var  isDiverse = false; 
            var lutRequired = false;
            var zIndexDefaultValue = Panel.ZIndexProperty.GetDefaultValue(this.DependencyObjectType); 
            var consonant = zIndexDefaultValue; 
            /*System.Collections.Generic.List<Int64>*/var stableKeyValues = null;
 
            if (count > 0)
            {
                if (this._uiElementCollection[0] != null)
                { 
                    consonant = this._uiElementCollection.Get(0).GetValue(Panel.ZIndexProperty);
                } 
 
                if (count > 1)
                { 
                    stableKeyValues = new /*System.Collections.Generic.*/List/*<Int64>*/(count);
                    stableKeyValues.Add(/*(Int64)*/consonant << 32);

                    var prevZ = consonant; 

                    var i = 1; 
                    do 
                    {
                        /*int*/var z = _uiElementCollection.Get(i) != null 
                            ? this._uiElementCollection.Get(i).GetValue(Panel.ZIndexProperty)
                            : zIndexDefaultValue;

                        //  this way of calculating values of stableKeyValues required to 
                        //  1)  workaround the fact that Array.Sort is not stable (does not preserve the original
                        //      order of elements if the keys are equal) 
                        //  2)  avoid O(N^2) performance of Array.Sort, which is QuickSort, which is known to become O(N^2) 
                        //      on sorting N eqial keys
                        stableKeyValues.Add((/*(Int64)*/z << 32) + i); 
                        //  look-up-table is required iff z's are not monotonically increasing function of index.
                        //  in other words if stableKeyValues[i] >= stableKeyValues[i-1] then calculated look-up-table
                        //  is guaranteed to be degenerated...
                        lutRequired |= z < prevZ; 
                        prevZ = z;
 
                        isDiverse |= (z != consonant); 
                    } while (++i < count);
                } 
            }

            if (lutRequired)
            { 
                stableKeyValues.Sort();
 
                if (this._zLut == null || this._zLut.length != count) 
                {
                	this._zLut = []; //new int[count]; 
                }

                for (var i = 0; i < count; ++i)
                { 
                	this._zLut[i] = (stableKeyValues.Get(i) & 0xffffffff);
                } 
            } 
            else
            { 
            	this._zLut = null;
            }

            this.IsZStateDiverse = isDiverse; 
            this._zConsonant = consonant;
            this.IsZStateDirty = false; 
        } 
        
	});
	
	Object.defineProperties(Panel.prototype,{
        /// <summary> 
        /// The Background property defines the brush used to fill the area between borders.
        /// </summary> 
//        public Brush 
        Background: 
        {
            get:function() { return this.GetValue(Panel.BackgroundProperty); }, 
            set:function(value) { this.SetValue(Panel.BackgroundProperty, value); }
        },
        
        /// <summary> 
        /// Returns enumerator to logical children.
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        {
            get:function()
            { 
                if ((this.VisualChildrenCount == 0) || this.IsItemsHost)
                { 
                    // empty panel or a panel being used as the items 
                    // host has *no* logical children; give empty enumerator
                    return EmptyEnumerator.Instance; 
                }

                // otherwise, its logical children is its visual children
                return this.Children.GetEnumerator(); 
            }
        },
        
        /// <summary>
        /// Returns a UIElementCollection of children for user to add/remove children manually 
        /// Returns read-only collection if Panel is data-bound (no manual control of children is possible,
        /// the associated ItemsControl completely overrides children)
        /// Note: the derived Panel classes should never use this collection for
        /// internal purposes like in their MeasureOverride or ArrangeOverride. 
        /// They should use InternalChildren instead, because InternalChildren
        /// is always present and either is a mirror of public Children collection (in case of Direct Panel) 
        /// or is generated from data binding. 
        /// </summary>
//        public UIElementCollection 
        Children:
        {
            get:function()
            { 
                //When we will change from UIElementCollection to IList<UIElement>, we might
                //consider returning a wrapper IList here which coudl be read-only for mutating methods 
                //while INternalChildren could be R/W even in case of Generator attached. 
                return this.InternalChildren;
            } 
        },
        
        /// <summary>
        ///     IsItemsHost is set to true to indicate that the panel
        ///     is the container for UI generated for the items of an 
        ///     ItemsControl.  It is typically set in a style for an ItemsControl.
        /// </summary> 
//        public bool 
        IsItemsHost:
        { 
            get:function() { return this.GetValue(Panel.IsItemsHostProperty); },
            set:function(value) { this.SetValue(Panel.IsItemsHostProperty, value); }
        },
        
        /// <summary>
        ///     This is the public accessor for protected property LogicalOrientation. 
        /// </summary>
//        public Orientation 
        LogicalOrientationPublic:
        {
            get:function() { return this.LogicalOrientation; } 
        },
 
        /// <summary> 
        ///     Orientation of the panel if its layout is in one dimension.
        /// Otherwise HasLogicalOrientation is false and LogicalOrientation should be ignored 
        /// </summary>
//        protected internal virtual Orientation 
        LogicalOrientation:
        {
            get:function() { return this.Orientation.Vertical; } 
        },
 
        /// <summary> 
        ///     This is the public accessor for protected property HasLogicalOrientation.
        /// </summary> 
//        public bool 
        HasLogicalOrientationPublic:
        {
            get:function() { return this.HasLogicalOrientation; }
        }, 

        /// <summary> 
        ///     HasLogicalOrientation is true in case the panel layout is only one dimension (Stack panel). 
        /// </summary>
//        protected internal virtual bool 
        HasLogicalOrientation: 
        {
            get:function() { return false; }
        },
 
        /// <summary> 
        /// Returns a UIElementCollection of children - added by user or generated from data binding.
        /// Panel-derived classes should use this collection for all internal purposes, including
        /// MeasureOverride/ArrangeOverride overrides.
        /// </summary> 
//        protected internal UIElementCollection 
        InternalChildren:
        { 
            get:function() 
            {
            	this.VerifyBoundState(); 

                if (this.IsItemsHost)
                {
                	this.EnsureGenerator(); 
                }
                else 
                { 
                    if (this._uiElementCollection == null)
                    { 
                        // First access on a regular panel
                    	this.EnsureEmptyChildren(/* logicalParent = */ this);
                    }
                } 

                return this._uiElementCollection; 
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
        ///     The generator associated with this panel. 
        /// </summary>
//        internal IItemContainerGenerator 
        Generator:
        {
            get:function() 
            {
                return this._itemContainerGenerator; 
            } 
        },
 
        //
        // Bool field used by VirtualizingStackPanel 
        // 
//        internal bool 
        VSP_IsVirtualizing:
        { 
            get:function()
            {
                return this.GetBoolField(BoolField.IsVirtualizing);
            }, 

            set:function(value) 
            { 
            	this.SetBoolField(BoolField.IsVirtualizing, value);
            } 
        },

        //
        // Bool field used by VirtualizingStackPanel 
        //
//        internal bool 
        VSP_HasMeasured: 
        { 
            get:function()
            { 
                return this.GetBoolField(BoolField.HasMeasured);
            },

            set:function(value) 
            {
            	this.SetBoolField(BoolField.HasMeasured, value); 
            } 
        },
 

        //
        // Bool field used by VirtualizingStackPanel
        // 
//        internal bool 
        VSP_MustDisableVirtualization:
        { 
            get:function() 
            {
                return this.GetBoolField(BoolField.MustDisableVirtualization); 
            },

            set:function(value)
            { 
            	this.SetBoolField(BoolField.MustDisableVirtualization, value);
            } 
        }, 

        // 
        // Bool field used by VirtualizingStackPanel
        //
//        internal bool 
        VSP_IsPixelBased:
        { 
            get:function()
            { 
                return this.GetBoolField(BoolField.IsPixelBased); 
            },
 
            set:function(value)
            {
            	this.SetBoolField(BoolField.IsPixelBased, value);
            } 
        },
 
        // 
        // Bool field used by VirtualizingStackPanel
        // 
//        internal bool 
        VSP_InRecyclingMode:
        {
            get:function()
            { 
                return this.GetBoolField(BoolField.InRecyclingMode);
            }, 
 
            set:function(value)
            { 
            	this.SetBoolField(BoolField.InRecyclingMode, value);
            }
        },
 
        //
        // Bool field used by VirtualizingStackPanel 
        // 
//        internal bool 
        VSP_MeasureCaches:
        { 
            get:function()
            {
                return this.GetBoolField(BoolField.MeasureCaches);
            }, 

            set:function(value) 
            { 
            	this.SetBoolField(BoolField.MeasureCaches, value);
            } 
        },
        //"actually data-bound and using generator" This is true if Panel is 
        //not only marked as IsItemsHost but actually has requested Generator to
        //generate items and thus "owns" those items. 
        //In this case, Children collection becomes read-only
        //Cases when it is not true include "direct" usage - IsItemsHost=false and
        //usages when panel is data-bound but derived class avoid accessing InternalChildren or Children
        //and rather calls CreateUIElementCollection and then drives Generator itself. 
//        internal bool 
        IsDataBound:
        { 
            get:function() 
            {
                return this.IsItemsHost && this._itemContainerGenerator != null; 
            }
        },
        

//        private bool 
        IsZStateDirty: 
        { 
            get:function() { return this.GetBoolField(BoolField.IsZStateDirty); },
            set:function(value) { this.SetBoolField(BoolField.IsZStateDirty, value); } 
        },

//        private bool 
        IsZStateDiverse:
        { 
            get:function() { return this.GetBoolField(BoolField.IsZStateDiverse); },
            set:function(value) { this.SetBoolField(BoolField.IsZStateDiverse, value); } 
        }

 
	});
	
	Object.defineProperties(Panel,{
        /// <summary> 
        /// DependencyProperty for <see cref="Background" /> property.
        /// </summary> 
//        public static readonly DependencyProperty 
        BackgroundProperty:
        {
        	get:function(){
        		if(Panel._BackgroundProperty === undefined){
        			Panel._BackgroundProperty =
                        DependencyProperty.Register("Background", 
                        		Brush.Type,
                                Panel.Type,
                                /*new FrameworkPropertyMetadata((Brush)null,
                                        FrameworkPropertyMetadataOptions.AffectsRender | 
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender)*/
                                FrameworkPropertyMetadata.Build2(null,
                                        FrameworkPropertyMetadataOptions.AffectsRender | 
                                        FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender));
        		}
        		
        		return Panel._BackgroundProperty;
        	}
        },
        
      /// <summary>
        ///     The DependencyProperty for the IsItemsHost property. 
        ///     Flags:              NotDataBindable 
        ///     Default Value:      false
        /// </summary> 
//        public static readonly DependencyProperty 
        IsItemsHostProperty:
        {
        	get:function(){
        		if(Panel._IsItemsHostProperty === undefined){
        			Panel._IsItemsHostProperty =
                        DependencyProperty.Register(
                                "IsItemsHost",
                                Boolean.Type, 
                                Panel.Type,
                                /*new FrameworkPropertyMetadata( 
                                        false, // defaultValue 
                                        FrameworkPropertyMetadataOptions.NotDataBindable,
                                        new PropertyChangedCallback(null, OnIsItemsHostChanged))*/
                                FrameworkPropertyMetadata.Build3PCCB( 
                                        false, // defaultValue 
                                        FrameworkPropertyMetadataOptions.NotDataBindable,
                                        new PropertyChangedCallback(null, OnIsItemsHostChanged))); 
        		}
        		
        		return Panel._IsItemsHostProperty;
        	}
        },
        
        /// <summary> 
        /// ZIndex property is an attached property. Panel reads it to alter the order
        /// of children rendering. Children with greater values will be rendered on top of 
        /// children with lesser values. 
        /// In case of two children with the same ZIndex property value, order of rendering
        /// is determined by their order in Panel.Children collection. 
        /// </summary>
//        public static readonly DependencyProperty 
        ZIndexProperty:
        {
        	get:function(){
        		if(Panel._ZIndexProperty === undefined){
        			Panel._ZIndexProperty =
                        DependencyProperty.RegisterAttached(
                                "ZIndex", 
                                /*typeof(int)*/Number.Type,
                                Panel.Type, 
                                /*new FrameworkPropertyMetadata( 
                                        c_zDefaultValue,
                                        new PropertyChangedCallback(null, OnZIndexPropertyChanged))*/
                                FrameworkPropertyMetadata.BuildWithDVandPCCB(
                                		c_zDefaultValue,
                                        new PropertyChangedCallback(null, OnZIndexPropertyChanged))); 
        		}
        		
        		return Panel._ZIndexProperty;
        	}
        },
	});
	
//    private static void 
    function OnIsItemsHostChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        Panel panel = (Panel) d; 

        d.OnIsItemsHostChanged(/*(bool)*/ e.OldValue, /*(bool)*/ e.NewValue); 
    }
    
    /// <summary> Used by subclasses to decide whether to call through a profiling stub </summary> 
//    internal static bool 
    Panel.IsAboutToGenerateContent = function(/*Panel*/ panel)
    { 
        return panel.IsItemsHost && panel._itemContainerGenerator == null; 
    };
    
    /// <summary>
    /// Helper for setting ZIndex property on a UIElement.
    /// </summary> 
    /// <param name="element">UIElement to set ZIndex property on.</param>
    /// <param name="value">ZIndex property value.</param> 
//    public static void 
    function SetZIndex(/*UIElement*/ element, /*int*/ value) 
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element");
        }

        element.SetValue(Panel.ZIndexProperty, value);
    } 

    /// <summary>
    /// Helper for reading ZIndex property from a UIElement. 
    /// </summary>
    /// <param name="element">UIElement to read ZIndex property from.</param>
    /// <returns>ZIndex property value.</returns>
//    public static int 
    Panel.GetZIndex = function(/*UIElement*/ element) 
    {
        if (element == null) 
        { 
            throw new ArgumentNullException("element");
        } 

        return (/*(int)*/element.GetValue(Panel.ZIndexProperty));
    };

    /// <summary>
    /// <see cref="PropertyMetadata.PropertyChangedCallback"/> 
    /// </summary> 
//    private static void 
    function OnZIndexPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        /*int*/var oldValue = e.OldValue;
        /*int*/var newValue = e.NewValue;

        if (oldValue == newValue) 
            return;

        /*UIElement*/var child = d instanceof UIElement ? d : null; 
        if (child == null)
            return; 

        /*Panel*/var panel = child.InternalVisualParent;
        panel = panel instanceof Panel ? panel : null;
        if (panel == null)
            return; 


        panel.InvalidateZState(); 
    }
	
	Panel.Type = new Type("Panel", Panel, [FrameworkElement.Type, IAddChild.Type]);
	return Panel;
});