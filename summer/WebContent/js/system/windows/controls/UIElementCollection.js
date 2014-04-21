/**
 * Second Check 12-08
 * UIElementCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/IList", "media/VisualCollection"], 
		function(declare, Type, IList, VisualCollection){
	var UIElementCollection = declare("UIElementCollection", IList,{
		constructor:function(/*UIElement*/ visualParent, /*FrameworkElement*/ logicalParent)
        { 
            if (visualParent == null) 
            {
                throw new ArgumentNullException(SR.Get(SRID.Panel_NoNullVisualParent, "visualParent", this.GetType())); 
            }

            this._visualChildren = new VisualCollection(visualParent);
            this._visualParent = visualParent; 
            this._logicalParent = logicalParent;
        },
        
        Get:function(index) 
        { 
        	var ui = this._visualChildren.Get(index);
        	return ui =ui instanceof UIElement ? ui : null; 
        },
        
        Set:function(index, value)
        {
        	this.VerifyWriteAccess(); 
            this.ValidateElement(value);

            /*VisualCollection*/var vc = this._visualChildren; 

            //if setting new element into slot or assigning null, 
            //remove previously hooked element from the logical tree
            if (vc.Get(index)/*[index]*/ != value)
            {
                /*UIElement*/var e = vcGet(index)/*[index]*/;
                e = e instanceof UIElement ? e : null; 
                if (e != null)
                    this.ClearLogicalParent(e); 

                vc.Set(index, value); //[index] = value;

                this.SetLogicalParent(value);

                this._visualParent.InvalidateMeasure();
            } 
        },
        
        /// <summary>
        /// Copies the collection into the Array. 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary>
//        public virtual void 
        CopyTo:function(/*Array*/ array, /*int*/ index)
        { 
            this._visualChildren.CopyTo(array, index);
        },
        
        // Warning: this method is very dangerous because it does not prevent adding children
        // into collection populated by generator. This may cause crashes if used incorrectly. 
        // Don't call this unless you are deriving a panel that is populating the collection
        // in cooperation with the generator
//        internal void 
        SetInternal:function(/*int*/ index, /*UIElement*/ item)
        { 
            this.ValidateElement(item);
 
            /*VisualCollection*/var vc = this._visualChildren; 

            if(vc.Get(index)/*[index]*/ != item) 
            {
                vc.Set(index, null); //[index] = null; // explicitly disconnect the existing visual;
                vc.Set(index, item); //[index] = item;
 
                this._visualParent.InvalidateMeasure();
            } 
        },

 
        /// <summary>
        /// Adds the element to the UIElementCollection
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary> 
//        public virtual int 
        Add:function(/*UIElement*/ element)
        { 
        	this.VerifyWriteAccess(); 

            return this.AddInternal(element); 
        },

        // Warning: this method is very dangerous because it does not prevent adding children
        // into collection populated by generator. This may cause crashes if used incorrectly. 
        // Don't call this unless you are deriving a panel that is populating the collection
        // in cooperation with the generator 
//        internal int 
        AddInternal:function(/*UIElement*/ element) 
        {
        	this.ValidateElement(element); 

            this.SetLogicalParent(element);
            var retVal = this._visualChildren.Add(element);
 
            // invalidate measure on visual parent
            this._visualParent.InvalidateMeasure(); 
            
            
//            this._visualParent.Arrange(this._visualParent._parentDom);
            
//            this._visualParent.OnAddChild(element);
 
            return retVal;
        },

        /// <summary>
        /// Returns the index of the element in the UIElementCollection
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" /> 
        /// </summary>
//        public virtual int 
        IndexOf:function(/*UIElement*/ element) 
        { 
            return this._visualChildren.IndexOf(element);
        },

        /// <summary>
        /// Removes the specified element from the UIElementCollection.
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" /> 
        /// </summary>
//        public virtual void 
        Remove:function(/*UIElement*/ element) 
        { 
        	this.VerifyWriteAccess();
 
            this.RemoveInternal(element);
        },

//        internal void 
        RemoveInternal:function(/*UIElement*/ element) 
        {
            this._visualChildren.Remove(element); 
            this.ClearLogicalParent(element); 
            this._visualParent.InvalidateMeasure();
        },

        /// <summary>
        /// Removes the specified element from the UIElementCollection.
        /// Used only by ItemsControl and by VirtualizingStackPanel 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary> 
//        internal virtual void 
        RemoveNoVerify:function(/*UIElement*/ element) 
        {
            this._visualChildren.Remove(element); 
        },

        /// <summary>
        /// Determines whether a element is in the UIElementCollection. 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary> 
//        public virtual bool 
        Contains:function(/*UIElement*/ element) 
        {
            return this._visualChildren.Contains(element); 
        },

        /// <summary>
        /// Removes all elements from the UIElementCollection. 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary> 
//        public virtual void 
        Clear:function() 
        {
        	this.VerifyWriteAccess(); 

            this.ClearInternal();
        },
 

        // Warning: this method is very dangerous because it does not prevent adding children 
        // into collection populated by generator. This may cause crashes if used incorrectly. 
        // Don't call this unless you are deriving a panel that is populating the collection
        // in cooperation with the generator 
//        internal void 
        ClearInternal:function()
        {
            /*VisualCollection*/var vc = this._visualChildren;
            var cnt = vc.Count; 

            if (cnt > 0) 
            { 
                // copy children in VisualCollection so that we can clear the visual link first,
                // followed by the logical link 
                /*Visual[]*/var visuals = []; //new Visual[cnt];
                for (var i = 0; i < cnt; i++)
                {
                    visuals[i] = vc.Get(i); //[i]; 
                }
 
                vc.Clear(); 

                //disconnect from logical tree 
                for (var i = 0; i < cnt; i++)
                {
                    /*UIElement*/var e = visuals[i] instanceof UIElement ? visuals[i] : null;
                    if (e != null) 
                    {
                        this.ClearLogicalParent(e); 
                    } 
                }
 
                this._visualParent.InvalidateMeasure();
            }
        },
 
        /// <summary>
        /// Inserts an element into the UIElementCollection at the specified index. 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" /> 
        /// </summary>
//        public virtual void 
        Insert:function(/*int*/ index, /*UIElement*/ element) 
        {
        	this.VerifyWriteAccess();

            this.InsertInternal(index, element); 
        },
 
        // Warning: this method is very dangerous because it does not prevent adding children 
        // into collection populated by generator. This may cause crashes if used incorrectly.
        // Don't call this unless you are deriving a panel that is populating the collection 
        // in cooperation with the generator
//        internal void 
        InsertInternal:function(/*int*/ index, /*UIElement*/ element)
        {
            this.ValidateElement(element); 

            this.SetLogicalParent(element); 
            this._visualChildren.Insert(index, element); 
            this._visualParent.InvalidateMeasure();
            
            this._visualParent.OnAddChild(element);
            
        },

        /// <summary>
        /// Removes the UIElement at the specified index.
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" /> 
        /// </summary>
//        public virtual void 
        RemoveAt:function(/*int*/ index) 
        { 
        	this.VerifyWriteAccess();
 
            /*VisualCollection*/var vc = this._visualChildren;

            //disconnect from logical tree
            /*UIElement*/var e = vc.Get(index);
            e = e instanceof UIElement ? e : null; 

            vc.RemoveAt(index); 
 
            if (e != null){
            	this.ClearLogicalParent(e); 
                this._visualParent.OnRemoveChild(element);  //cym add
            }

            this._visualParent.InvalidateMeasure();

        },
 

        /// <summary> 
        /// Removes a range of Visuals from the VisualCollection. 
        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
        /// </summary> 
//        public virtual void 
        RemoveRange:function(/*int*/ index, /*int*/ count)
        {
        	this.VerifyWriteAccess();
 
        	this.RemoveRangeInternal(index, count);
        },
 
        // Warning: this method is very dangerous because it does not prevent adding children
        // into collection populated by generator. This may cause crashes if used incorrectly. 
        // Don't call this unless you are deriving a panel that is populating the collection
        // in cooperation with the generator
//        internal void 
        RemoveRangeInternal:function(/*int*/ index, /*int*/ count)
        { 
            /*VisualCollection*/var vc = this._visualChildren;
            var cnt = vc.Count; 
            if (count > (cnt - index)) 
            {
                count = cnt - index; 
            }

            if (count > 0)
            { 
                // copy children in VisualCollection so that we can clear the visual link first,
                // followed by the logical link 
                /*Visual[]*/var visuals = []; //new Visual[count]; 
                var i = index;
                for (var loop = 0; loop < count; i++, loop++) 
                {
                    visuals[loop] = vc.Get(i); //[i];
                }
 
                vc.RemoveRange(index, count);
 
                //disconnect from logical tree 
                for (i = 0; i < count; i++)
                { 
                    /*UIElement*/var e = visuals[i] instanceof UIElement ? visuals[i] : null;
                    if (e != null)
                    {
                        this.ClearLogicalParent(e); 
                    }
                    
                    this._visualParent.OnRemoveChild(e);   //cym add
                } 
 
                this._visualParent.InvalidateMeasure();
            } 

        },

 
        /// <summary>
        /// Method that forwards to VisualCollection.Move 
        /// </summary> 
        /// <param name="visual"></param>
        /// <param name="destination"></param> 
//        internal void 
        MoveVisualChild:function(/*Visual*/ visual, /*Visual*/ destination)
        {
            this._visualChildren.Move(visual, destination);
        },
 		
//        private UIElement 
        Cast:function(/*object*/ value) 
        { 
            if (value == null)
                throw new System.ArgumentException(SR.Get(SRID.Collection_NoNull, "UIElementCollection")); 

            /*UIElement*/var element = value instanceof UIElement ? value : null;

            if (element == null) 
                throw new System.ArgumentException(SR.Get(SRID.Collection_BadType, "UIElementCollection", value.GetType().Name, "UIElement"));
 
            return element; 
        },
        /// <summary>
        /// Returns an enumerator that can iterate through the collection. 
        /// </summary>
        /// <returns>Enumerator that enumerates the collection in order.</returns>
//        public virtual IEnumerator 
        GetEnumerator:function()
        { 
            return this._visualChildren.GetEnumerator();
        }, 
 
        /// <summary>
        ///     This method does logical parenting of the given element. 
        /// </summary>
        /// <param name="element"></param>
//        protected void 
        SetLogicalParent:function(/*UIElement*/ element)
        { 
            if (this._logicalParent != null)
            { 
                this._logicalParent.AddLogicalChild(element); 
            }
        }, 

        /// <summary>
        ///     This method removes logical parenting when element goes away from the collection.
        /// </summary> 
        /// <param name="element"></param>
//        protected void 
        ClearLogicalParent:function(/*UIElement*/ element) 
        { 
            if (this._logicalParent != null)
            { 
            	this._logicalParent.RemoveLogicalChild(element);
            }
        },
        
        // Helper function to validate element; will throw exceptions if problems are detected. 
//        private void 
        ValidateElement:function(/*UIElement*/ element)
        { 
            if (element == null) 
            {
                throw new ArgumentNullException(SR.Get(SRID.Panel_NoNullChildren, this.GetType())); 
            }
        },

//        private void 
        VerifyWriteAccess:function() 
        {
            /*Panel*/var p = this._visualParent instanceof Panel ? this._visualParent : null; 
            if (p != null && p.IsDataBound) 
            {
                throw new InvalidOperationException(SR.Get(SRID.Panel_BoundPanel_NoChildren)); 
            }
        }
	});
	
	Object.defineProperties(UIElementCollection.prototype,{
	      /// <summary> 
        /// Gets the number of elements in the collection.
        /// </summary>
//        public virtual int 
        Count:
        { 
            get:function() { return this._visualChildren.Count; }
        }, 
 
//        /// <summary> 
//        /// For more details, see <see cref="System.Windows.Media.VisualCollection" />
//        /// </summary>
//        public virtual int Capacity
//        { 
//            get { return _visualChildren.Capacity; }
//            set 
//            { 
//                VerifyWriteAccess();
// 
//                _visualChildren.Capacity = value;
//            }
//        },
        
        /// <summary>
        /// Provides access to visual parent. 
        /// </summary> 
//        internal UIElement 
        VisualParent:
        { 
            get:function() { return (this._visualParent); }
        },
        

//        internal FrameworkElement 
        LogicalParent: 
        {
            get:function() { return this._logicalParent; } 
        },
        
        /// <summary>
        /// </summary> 
//        bool IList.
        IsFixedSize:
        {
            get:function() { return false; }
        }, 

        /// <summary> 
        /// </summary> 
//        bool IList.
        IsReadOnly:
        { 
            get:function() { return false; }
        }
	});
	
	UIElementCollection.Type = new Type("UIElementCollection", UIElementCollection, [IList.Type]);
	return UIElementCollection;
});

//        /// <summary>
//        /// For more details, see <see cref="System.Windows.Media.VisualCollection" /> 
//        /// </summary>
//        object IList.this[int index] 
//        { 
//            get
//            { 
//                return this[index];
//            }
//            set
//            { 
//                this[index] = Cast(value);
//            } 
//        } 
//
//        private readonly VisualCollection _visualChildren; 
//        private readonly UIElement _visualParent;
//        private readonly FrameworkElement _logicalParent;

