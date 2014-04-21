/**
 * Decorator
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "windows/UIElement", "markup/IAddChild",
        "internal/controls/EmptyEnumerator", "windows/SingleChildEnumerator"], 
		function(declare, Type, FrameworkElement, UIElement, IAddChild, 
				EmptyEnumerator, SingleChildEnumerator){
	var Decorator = declare("Decorator", [FrameworkElement, IAddChild], {
	       ///<summary> 
        /// This method is called to Add the object as a child of the Decorator.  This method is used primarily
        /// by the parser; a more direct way of adding a child to a Decorator is to use the <see cref="Child" />
        /// property.
        ///</summary> 
        ///<param name="value">
        /// The object to add as a child; it must be a UIElement. 
        ///</param> 
//        void IAddChild.
        AddChild:function(/*Object*/ value)
        { 
            if (!(value instanceof UIElement))
            {
                throw new Error('ArgumentException (SR.Get(SRID.UnexpectedParameterType, value.GetType(), typeof(UIElement)), "value")');
            } 

            if (this.Child != null) 
            { 
                throw new Error('ArgumentException(SR.Get(SRID.CanOnlyHaveOneChild, this.GetType(), value.GetType())');
            } 

            this.Child = value;
        },

   

        /// <summary> 
        /// Returns the child at the specified index.
        /// </summary> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if ((this._child == null) 
                ||  (index != 0))
            {
                throw new Error('ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange)');
            } 

            return this._child; 
        },

        /// <summary> 
        /// Updates DesiredSize of the Decorator.  Called by parent UIElement.  This is the first pass of layout.
        /// </summary>
        /// <remarks>
        /// Decorator determines a desired size it needs from the child's sizing properties, margin, and requested size. 
        /// </remarks>
        /// <param name="constraint">Constraint size is an "upper limit" that the return value should not exceed.</param> 
        /// <returns>The Decorator's desired size.</returns> 
//        protected override Size 
        MeasureOverride:function()
        { 
            /*UIElement*/var child = this.Child;
            if (child != null)
            {
                child.Measure(); 
            } 
        },
 
        /// <summary>
        /// Decorator computes the position of its single child inside child's Margin and calls Arrange
        /// on the child.
        /// </summary> 
        /// <param name="arrangeSize">Size the Decorator will assume.</param>
//        protected override Size 
        ArrangeOverride:function() 
        { 
            /*UIElement*/var child = Child;
            if (child != null) 
            {
                child.Arrange(parent);
            }
        }

	});
	
	Object.defineProperties(Decorator.prototype,{
	     
        /// <summary> 
        /// The single child of a <see cref="System.Windows.Controls.Decorator" />
        /// </summary>
//        public virtual UIElement 
        Child:
        {
            get:function() 
            { 
                return this._child;
            },

            set:function(value)
            {
                if(this._child != value) 
                {
                    // notify the visual layer that the old child has been removed. 
                	this.RemoveVisualChild(this._child); 

                    //need to remove old element from logical tree 
                    this.RemoveLogicalChild(this._child);

                    this._child = value;
 
                    this.AddLogicalChild(value);
                    // notify the visual layer about the new child. 
                    this. AddVisualChild(value); 

//                    this.InvalidateMeasure(); 
                }
            }
        },
 
        /// <summary>
        /// Returns enumerator to logical children. 
        /// </summary> 
//        protected internal override IEnumerator 
        LogicalChildren:
        { 
            get:function()
            {
                if (this._child == null)
                { 
                    return EmptyEnumerator.Instance;
                } 
 
                return new SingleChildEnumerator(this._child);
            } 
        },

 
        /// <summary>
        /// Returns the Visual children count. 
        /// </summary> 
//        protected override int 
        VisualChildrenCount:
        { 
            get:function() { return (this._child == null) ? 0 : 1; }
        },
        
//        internal UIElement 
        IntChild:
        {
            get:function() { return this._child; },
            set:function(value) { this._child = value; } 
        }
	});
	
	Decorator.Type = new Type("Decorator", Decorator, [FrameworkElement.Type, IAddChild.Type]);
	return Decorator;
});

 